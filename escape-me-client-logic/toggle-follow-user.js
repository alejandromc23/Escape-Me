require('escape-me-commons/polyfills/string')
const { utils: { call } } = require('escape-me-commons')
const context = require('./context')
const { errors: { UnexistenceError } } = require('escape-me-commons')


/**
 * Changes the user's following state.
 * 
 * @param {String} userId The id of a user.
 *
 * @returns {Promise} Nothing if all has gone well, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (userId) {
    String.validate(userId)

    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call(
            'PATCH',
            `${this.API_URL}/users/follow`,
            `{ "user": "${userId}" }`,
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