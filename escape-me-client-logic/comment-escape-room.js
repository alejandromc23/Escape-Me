require('escape-me-commons/polyfills/string')
require('escape-me-commons/polyfills/number')

const { utils: { call } } = require('escape-me-commons')
const context = require('./context')
const { errors: { UnexistenceError } } = require('escape-me-commons')

/**
 * Adds comment to escape room.
 * 
 * @param {string} escapeId The escape room id. 
 * @param {string} comment The user comment.
 * 
 * @returns {Promise} Nothing it all has gone well, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (escapeId, comment) {
    String.validate(escapeId)
    String.validate(comment)

    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call(
            'POST',
            `${this.API_URL}/escape/comment/`,
            `{ "escapeId": "${escapeId}", "comment": "${comment}" }`,
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