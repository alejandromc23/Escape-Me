require('escape-me-commons/polyfills/string')
const { mongoose: { ObjectId }, models: { User } } = require('escape-me-data')

/**
 * Retrieves essential info of different escape rooms.
 * 
 * @param {String} userId The id of a user.
 * @param {string} tag The user relation with a escape room. 
 * 
 * @returns {Promise<Array>} An array of Objects, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = (userId, tag) => {
    String.validate.notVoid(userId)
    String.validate.notVoid(tag)

    return (async () => {
        const user = await User.findById(userId).populate(tag).lean()

        if (!user) throw new Error(`user with id ${userId} does not exist`)

        const escapeRoomList = user[tag].map(({ _id, name, priceMin, priceMax, playersMin, playersMax, genre, city, image, rating }) => ({ id: _id, name, priceMin, priceMax, playersMin, playersMax, genre, city, image, rating }))

        return escapeRoomList
    })()
}