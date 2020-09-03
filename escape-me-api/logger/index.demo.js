const { Logger, single } = require('.')

{
    const logger = new Logger('./system.log')

    logger.debug('hola mundo')
    logger.info('hola mundo')
    logger.warn('hola mundo')
    logger.error('hola mundo')
    logger.fatal('hola mundo')
}

{
    const logger = single('./pepito.log')

    logger.debug('hola mundo')
    logger.info('hola mundo')
    logger.warn('hola mundo')
    logger.error('hola mundo')
    logger.fatal('hola mundo')
}

{
    const logger = single()

    logger.debug('hola mundo')
    logger.info('hola mundo')
    logger.warn('hola mundo')
    logger.error('hola mundo')
    logger.fatal('hola mundo')
}
