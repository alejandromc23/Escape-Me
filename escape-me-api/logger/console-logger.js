const Logger = require('./logger')

module.exports = (() => { // module pattern
    const FgGreen = "\x1b[32m" // DEBUG
    const FgBlue = "\x1b[34m" // INFO
    const FgYellow = "\x1b[33m" // WARN
    const FgMagenta = "\x1b[35m" // ERROR
    const FgRed = "\x1b[31m" // FATAL

    const colors = [FgGreen, FgBlue, FgYellow, FgMagenta, FgRed]

    return class FileLogger extends Logger {
        __write__(message, level) {
            console.log(colors[level], message)
        }
    }
})()