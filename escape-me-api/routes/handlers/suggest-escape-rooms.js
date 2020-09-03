const { suggestEscapeRooms } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')
const { utils: { jwtPromised } } = require('escape-me-node-commons')
const { env: { SECRET } } = process

module.exports = (req, res) => {
    try {
        let token
        if (req.header('authorization')) [, token] = req.header('authorization').split(' ')

        if (token) {
            jwtPromised.verify(token, SECRET)
                .then(payload => {
                    req.payload = payload

                    const { payload: { sub: userId } } = req

                    return suggestEscapeRooms(userId)
                })
                .then(results => res.send(results))
                .catch(error => handleError(error, res))
        } else {
            suggestEscapeRooms()
                .then(results => res.send(results))
                .catch(error => handleError(error, res))
        }

    } catch (error) {
        handleError(error, res)
    }
}