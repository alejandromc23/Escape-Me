require('escape-me-commons/polyfills/string')
require('escape-me-commons/polyfills/number')

const { utils: { call } } = require('escape-me-commons')
const context = require('./context')
const { errors: { UnexistenceError } } = require('escape-me-commons')


/**
 * Checks user credentials.
 * 
 * @param {string} escapeId The escape room id. 
 * @param {Number} rating The user rating.
 * 
 * @returns {Promise} Nothing it all has gone well, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (escapeId, rating) {
    String.validate(escapeId)
    Number.validate.positive(rating)

    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call(
            'POST',
            `${this.API_URL}/escape/rate/`,
            `{ "escapeId": "${escapeId}", "rating": ${rating} }`,
            {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        )
            .then(({ status, body }) => {

                if (status === 204) return

                const { error } = JSON.parse(body)

                throw new UnexistenceError(error)
            })
    })();
}.bind(context)