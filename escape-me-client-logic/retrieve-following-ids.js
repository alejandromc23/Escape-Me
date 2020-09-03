require('escape-me-commons/polyfills/string')
const { utils: { call } } = require('escape-me-commons')
const context = require('./context')


/**
 * Retrieves the ids of people being followed.
 * 
 * @param {String} userId The Id of a user.
 * 
 * @returns {Promise<Array>} An array of Strings, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (userId) {
    if (userId) String.validate.notVoid(userId)

    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call('GET', `${this.API_URL}/ids/following/${userId ? userId : ''}`,
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