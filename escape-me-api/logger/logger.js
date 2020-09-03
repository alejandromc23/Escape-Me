module.exports = (() => { // module pattern
    const formatter = new Intl.DateTimeFormat('ca-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
    
    let __level__, __levels__

    return class Logger {
        static DEBUG = 0
        static INFO = 1
        static WARN = 2
        static ERROR = 3
        static FATAL = 4

        constructor() {
            __level__ = Logger.INFO

            __levels__ = Object.keys(Logger)
        }

        set level(level) {
            __level__ = level
        }

        __write__(message, level) {
            throw new Error('implement me!')
        }

        log(message, level = __level__) {
            level >= __level__ && this.__write__(`${__levels__[level]} ${formatter.format(new Date)} - ${message}\n`, level)
        }

        debug(message) {
            this.log(message, Logger.DEBUG)
        }

        info(message) {
            this.log(message, Logger.INFO)
        }

        warn(message) {
            this.log(message, Logger.WARN)
        }

        error(message) {
            this.log(message, Logger.ERROR)
        }

        fatal(message) {
            this.log(message, Logger.FATAL)
        }

        close() {
        }
    }
})()