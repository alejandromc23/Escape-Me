require('escape-me-commons/polyfills/string')
require('escape-me-commons/polyfills/number')
const { errors: { UnexistenceError } } = require('escape-me-commons')

const { mongoose: { ObjectId }, models: { User, EscapeRoom } } = require('escape-me-data')

/**
 * Adds comment to escape room.
 * @param {String} userId The id of a user.
 * @param {string} escapeId The escape room id. 
 * @param {string} comment The user comment.
 * 
 * @returns {Promise} Nothing it all has gone well, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = (userId, escapeId, userComment) => {
    String.validate.notVoid(userId)
    String.validate.notVoid(escapeId)
    String.validate.notVoid(userComment)

    return (async () => {
        const user = await User.findOne({ _id: ObjectId(userId) }, { __v: 0, password: 0 }).lean()

        if (!user) throw new UnexistenceError(`user with id ${userId} does not exist`)

        const escapeRoom = await EscapeRoom.findOne({ _id: escapeId }, { _v: 0 }).lean()

        if (!escapeRoom) throw new UnexistenceError(`escape room with id ${escapeId} does not exist`)

        const _reviews = escapeRoom['reviews']

        const index = _reviews.findIndex(item => item.user.toString() === userId)

        let date = new Date().toISOString()

        let [formatedDate,] = date.split('T')

        if (index >= 0) _reviews[index]['comment'] = { message: userComment, date: formatedDate }
        else throw new Error('escape room must be rated before comment')

        await EscapeRoom.findByIdAndUpdate({ _id: escapeId }, { reviews: _reviews })
    })()
}