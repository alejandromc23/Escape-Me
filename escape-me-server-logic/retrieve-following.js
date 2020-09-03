require('escape-me-commons/polyfills/string')
const { mongoose: { ObjectId }, models: { User } } = require('escape-me-data')

/**
 * Retrieves info of the people being followed.
 * 
 * @param {String} userId The Id of a user.
 * 
 * @returns {Promise<Array>} An array of Objects, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = userId => {
    String.validate.notVoid(userId)

    return (async () => {
        const user = await User.findById(userId).populate('following').lean()
        if (!user) throw new Error(`user with id ${userId} does not exist`)

        delete user.id
        delete user._id

        const following = user['following'].map(({ _id, name, surname, username }) => ({ id: _id, name, surname, username }))

        return following
    })()
}