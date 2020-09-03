require('escape-me-commons/polyfills/string')
const { utils: { call } } = require('escape-me-commons')
const context = require('./context')


/**
 *  Returns detailed info of a escape room.
 * 
 * @param {string} escapeId The escape room id. 
 * 
 * @returns {Promise<Object>} An object that contains detailed information of a escape room, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (escapeId) {
    String.validate.notVoid(escapeId)

    return call('GET', `${this.API_URL}/escape/details/${escapeId}`,
        undefined,
        { 'Content-Type': 'application/json' })
        .then(({ status, body }) => {
            if (status === 200) {
                return JSON.parse(body)
            } else {
                const { error } = JSON.parse(body)

                throw new Error(error)
            }
        })
}.bind(context)