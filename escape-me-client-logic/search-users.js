require('escape-me-commons/polyfills/string')
const { utils: { call }, errors: { UnexistenceError } } = require('escape-me-commons')

const context = require('./context')
/**
 * Search users.
 * 
 * @param {String} query The query searched.
 * 
 * @returns {Promise<Array>} An array of Objects, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (query) {
    String.validate.notVoid(query)

    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call('GET', `${this.API_URL}/users/search/${query ? query : ''}`,
            undefined,
            { 'Authorization': `Bearer ${token}` })
            .then(({ status, body }) => {
                if (status === 200) {
                    return JSON.parse(body)
                } else {
                    const { error } = JSON.parse(body)

                    throw new UnexistenceError(error)
                }
            })
    })();
}.bind(context)