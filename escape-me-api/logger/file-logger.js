const fs = require('fs')
const Logger = require('./logger')

module.exports = (() => { // module pattern
    let __ws__

    return class FileLogger extends Logger {
        constructor(path) {
            super()

            __ws__ = fs.createWriteStream(path, { flags: 'a' })
        }

        __write__(message) {
            __ws__.write(message)
        }

        close() {
            __ws__.close()
        }
    }
})()