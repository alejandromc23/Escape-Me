require('escape-me-commons/polyfills/string')
const { utils: { call } } = require('escape-me-commons')
const context = require('./context')
/**
 * Retrieves essential info of different escape rooms.
 * 
 * @param {string} tag The user relation with a escape room. 
 * @param {String} id The id of a user.
 * 
 * @returns {Promise<Array>} An array of Objects, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (tag, userId) {
    String.validate.notVoid(tag)

    if (userId) String.validate.notVoid(userId)

    let token
    return (async () => {
        token = await context.storage.getItem('token')

        return call('GET', `${this.API_URL}/users/escape/${tag}/${userId ? userId : ''}`,
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