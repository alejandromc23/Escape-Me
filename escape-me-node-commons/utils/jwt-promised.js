const jwt = require('jsonwebtoken')

module.exports = {
    sign(payload, secret, options) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secret, options, (error, token) => {
                if (error) return reject(error)

                resolve(token)
            })
        })
    },

    verify(token, secret) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (error, payload) => {
                if (error) return reject(error)

                resolve(payload)
            })
        })
    }
}