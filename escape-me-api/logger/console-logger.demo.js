const ConsoleLogger = require('./console-logger')

const logger = new ConsoleLogger()

logger.level = ConsoleLogger.ERROR

logger.debug('hola mundo')
logger.info('hola mundo')
logger.warn('hola mundo')
logger.error('hola mundo')
logger.fatal('hola mundo')