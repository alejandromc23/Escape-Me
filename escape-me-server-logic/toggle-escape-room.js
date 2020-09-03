require('escape-me-commons/polyfills/string')
const { errors: { UnexistenceError } } = require('escape-me-commons')
const { models: { User, EscapeRoom }, mongoose: { ObjectId } } = require('escape-me-data')

/**
 * Changes the escape room state relative to the user.
 * @param {String} userId The id of a user.
 * @param {String} escapeId The id of a escape room.
 * @param {String} tag The tag of the user's relation with some escape rooms.
 *
 * @returns {Promise} Nothing if all has gone well, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = (userId, escapeId, tag) => {
    String.validate.notVoid(userId);
    String.validate.notVoid(escapeId);
    String.validate.notVoid(tag);

    if (!['pending', 'favorites', 'participated'].includes(tag)) throw new UnexistenceError(`tag ${tag} does not exist`)

    return (async () => {
        const user = await User.findOne({ _id: ObjectId(userId) }, { __v: 0, password: 0 }).lean()

        if (!user) throw new UnexistenceError(`user with id ${userId} does not exist`)

        const escapeRoom = await EscapeRoom.findOne({ _id: ObjectId(escapeId) }, { __v: 0 }).lean()

        if (!escapeRoom) throw new UnexistenceError(`escape room with id ${escapeId} does not exist`)

        let userList
        if (!user[tag]) userList = []
        else userList = user[tag].map(item => item.toString())

        const index = userList.indexOf(escapeId)

        if (index < 0) userList.push(escapeId)

        else userList.splice(index, 1)

        userList = userList.map(item => ObjectId(item))

        tag === 'pending' && await User.findByIdAndUpdate({ _id: userId }, { "pending": userList })
        tag === 'favorites' && await User.findByIdAndUpdate({ _id: userId }, { "favorites": userList })
        tag === 'participated' && await User.findByIdAndUpdate({ _id: userId }, { "participated": userList })

    })()
}