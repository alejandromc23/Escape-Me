const { utils: { jwtPromised } } = require('escape-me-node-commons')

module.exports = (secret, errorHandler) =>
    (req, res, next) => {
        try {
            const [, token] = req.header('authorization').split(' ')

            jwtPromised.verify(token, secret)
                .then(payload => {
                    req.payload = payload

                    next()
                })
                .catch(error => errorHandler(error, res))
        } catch (error) {
            errorHandler(error, res)
        }
    }