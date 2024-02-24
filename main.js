var levelup = require('levelup')
var leveldown = require('leveldown')
const program = require('commander')
const {version} = require('./package.json')
const initLevel = require('./src/createDB');
const deleteLevel = require('./src/deleteDB');
const storage = require('./configuration')
const { encrypt, decrypt } = require('./src/crypto');

program
  .version(version)
  .option('-i, --init ', 'Init new database', '.')
  .option('-t, --temporary-delete ', 'Delete database', '.')
  .option('-p, --put ', 'Create new collection', '.')
  .option('-g, --get ', 'Get new collection', '.')
  .option('-d, --delete ', 'Delete new collection', '.')


program.command('init').alias('i')
    .action(() => {
        initLevel(storage['location'])
    })

program.command('delete').alias('t')
    .action(() => {
        deleteLevel(storage['path'])
    })

program.command('put <key> <value>').alias('p')
    .action(async(key, value) => {
        var db = levelup(leveldown(storage['location']))
        var hash = await encrypt(value, storage['user']['pw'])
        var lastInfo = hash['iv'] + '@' + hash['content']
        db.put(key, lastInfo, function (err) {
            if (err) return console.log('SHC P2P: failed to put document')
            console.log('SHC P2P: new file added to ' + storage['location'] + ', with key: ' + key + ', and hash: ' + lastInfo)
        })

    })

program.command('get <key>').alias('g')
    .action(async(key, cmd) => {
        var db = levelup(leveldown(storage['location']))
        db.get(key, async function (err, value) {
            if (err) return console.log('SHC P2P: key is not found')
            var sp = value.toString().split('@')
            var objM = { 'iv': sp[0], 'content': sp[1]}
            var hash = await decrypt(objM, storage['user']['pw'])
            var response = { '_id': key, 'content': JSON.parse(hash)}

            console.log('SHC P2P: listing unit: ' + key + ', with data: ' + JSON.stringify(response))
        })
    })




program.command('del <key>').alias('d')
  .action((key) => {
    var db = levelup(leveldown(storage['location']))
    db.del(key, async function (err) {
        if (err) return console.log('SHC P2P: failed to delete document')
        console.log('SHC P2P: deleting: ' + key)
    })
  })




program.command('*', {noHelp: true}).action(printHelp)

program.parse(process.argv)
if (program.args.length === 0) printHelp()

function printHelp () {
  program.outputHelp()
  process.exit(0)
}
