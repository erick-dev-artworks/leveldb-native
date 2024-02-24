
const fs = require('fs')
const path = require("path");

function emptyDir(dirPath) {
    const dirContents = fs.readdirSync(dirPath);
  
    for (const fileOrDirPath of dirContents) {
      try {
        const fullPath = path.join(dirPath, fileOrDirPath);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (fs.readdirSync(fullPath).length) emptyDir(fullPath);
          fs.rmdirSync(fullPath);
        } else fs.unlinkSync(fullPath);

        fs.rmdirSync(fullPath, { recursive: true }, err => {
            if (err) {
              throw err
            }
        })
      } catch (ex) {}
    }
}

module.exports = function initLevel (location) {
    try{ 
        emptyDir(location)
        fs.rmdirSync(location, { recursive: true }, err => {
            if (err) {
              throw err
            }
        })
        return 0
    }catch(e){
        return 1
    }
}