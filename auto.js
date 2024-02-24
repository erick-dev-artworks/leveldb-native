
var levelup = require('levelup')
var leveldown = require('leveldown')
const storage = require('./configuration')
const sleep = require('./modules/sleep')



var db = levelup(leveldown(storage['location']))

var index = 0
async function a(){
    while(1==1){
        index++
        function between(min, max) {  
            return Math.floor(
              Math.random() * (max - min) + min
            )
        }

        var n = Date.now() + between(0, Date.now())

        var cm = Date.now() + Date.now()
        var c = between(Date.now(), cm)

        db.put(n, c, function (err) {
            if (err) return console.log('Ooops!', err)

            console.log('SHC P2P: new file added to ' + storage['location'] + ', with key: ' + Date.now() + ', and value: ' + Date.now() + ', index: ' + index)
        })


        console.log('generationg: ', n)

        await sleep(20)
    }
}
// a()