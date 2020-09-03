require('escape-me-commons/polyfills/string')
const { utils: { call } } = require('escape-me-commons')
const context = require('./context')
const { errors: { UnexistenceError } } = require('escape-me-commons')
/**
 * Changes the escape room state relative to the user.
 * 
 * @param {String} escapeId The id of a escape room.
 * @param {String} tag The tag of the user's relation with some escape rooms.
 *
 * @returns {Promise} Nothing if all has gone well, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (escapeId, tag) {
    String.validate(escapeId)
    String.validate(tag)

    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call(
            'PATCH',
            `${this.API_URL}/users/${tag}`,
            `{ "escapeId": "${escapeId}" }`,
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