
const fs = require('fs')
var levelup = require('levelup')
var leveldown = require('leveldown')


module.exports = function initLevel (location) {
    try{ fs.readdirSync(location); console.log('SHC P2P: DB found, at directory: ', location)} catch(e){
        if(e !== undefined){console.log('SHC P2P: No level db was found at ', location, ', initializing new bitblock database')
            levelup(leveldown(location)); return false
        }
    }
}