const { errors: { DuplicityError, VoidError, UnexistenceError, CredentialsError } } = require('escape-me-commons')
const { JsonWebTokenError } = require('jsonwebtoken')
const logger = require('../logger').singletonFileLogger()

module.exports = function (error, res) {
    let status = 500

    switch (true) {
        case error instanceof TypeError || error instanceof VoidError:
            status = 406
            break
        case error instanceof DuplicityError || error instanceof UnexistenceError:
            status = 409
            break
        case error instanceof CredentialsError || error instanceof JsonWebTokenError:
            status = 401
            break
    }

    if (status < 500)
        logger.warn(`response with error status ${status} - ${error}`)
    else
        logger.error(`response with error status ${status} - ${error}`)

    res.status(status).json({ error: error.message })
}