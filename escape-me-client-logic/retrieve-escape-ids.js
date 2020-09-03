require('escape-me-commons/polyfills/string')
const { utils: { call } } = require('escape-me-commons')
const context = require('./context')


/**
 * Checks user credentials.
 * 
 * @param {string} userId The id of a user. 
 * 
 * @returns {Promise<Object>} An object that all the atributes are Arrays, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (userId) {
    if (userId) String.validate.notVoid(userId)

    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call('GET', `${this.API_URL}/ids/escapes/${userId ? userId : ''}`,
            undefined,
            { 'Authorization': `Bearer ${token}` })
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