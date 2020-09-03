require('escape-me-commons/polyfills/string')
const { mongoose: { ObjectId }, models: { EscapeRoom } } = require('escape-me-data')

/**
 *  Returns detailed info of a escape room.
 * 
 * @param {string} escapeId The escape room id. 
 * 
 * @returns {Promise<Object>} An object that contains detailed information of a escape room, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = escapeId => {
    String.validate.notVoid(escapeId)

    return (async () => {
        let escapeRoom = await EscapeRoom.findOne({ _id: ObjectId(escapeId) }, { __v: 0, _id: 0 }).populate('reviews.user').lean()

        if (!escapeRoom) throw new Error(`escape room with id ${escapeId} does not exist`)

        let reviews = escapeRoom['reviews']

        escapeRoom['reviews'] = reviews.map(({ user, comment, rating }) => ({ user: { name: user.name, surname: user.surname, username: user.username }, comment, rating }))


        return escapeRoom
    })()
}