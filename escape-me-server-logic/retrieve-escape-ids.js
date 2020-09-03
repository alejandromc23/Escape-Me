require('escape-me-commons/polyfills/string')
const { mongoose: { ObjectId }, models: { User } } = require('escape-me-data')

/**
 * Checks user credentials.
 * 
 * @param {string} userId The id of a user. 
 * 
 * @returns {Promise<Object>} An object that all the atributes are Arrays, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = userId => {
    String.validate.notVoid(userId)

    return (async () => {
        const user = await User.findOne({ _id: ObjectId(userId) }, { __v: 0, password: 0 }).lean()
        if (!user) throw new Error(`user with id ${userId} does not exist`)

        delete user.id
        delete user._id

        const { participated, pending, favorites } = user

        return { participated, pending, favorites }
    })()
}