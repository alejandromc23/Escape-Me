require('escape-me-commons/polyfills/string')
const { utils: { call } } = require('escape-me-commons')
const context = require('./context')

/**
 * Suggests potential favorites escape rooms.
 * 
 * @returns {Promise<Array>} An array of Objects, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function () {
    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call('GET', `${this.API_URL}/suggest/`,
            undefined,
            token ? { 'Authorization': `Bearer ${token}` } : { 'Content-type': 'application/json' })
            .then(({ status, body }) => {
                if (status === 200) {
                    return JSON.parse(body)
                } else {
                    const { error } = JSON.parse(body)

                    throw new Error(error)
                }
            })
    })();
}.bind(context)