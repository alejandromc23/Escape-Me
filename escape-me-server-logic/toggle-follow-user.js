require('escape-me-commons/polyfills/string')
const { errors: { UnexistenceError } } = require('escape-me-commons')
const { models: { User }, mongoose: { ObjectId } } = require('escape-me-data')


/**
 * Changes the user's following state.
 * 
 * @param {String} userId The id of a user.
 * @param {String} otherUserId The id of another user.
 * 
 * @returns {Promise} Nothing if all has gone well, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = (userId, otherUserId) => {
    String.validate.notVoid(userId);
    String.validate.notVoid(otherUserId);

    return (async () => {
        const user = await User.findOne({ _id: ObjectId(userId) }, { __v: 0, password: 0 }).lean()

        if (!user) throw new UnexistenceError(`user with id ${userId} does not exist`)

        const otherUser = await User.findOne({ _id: ObjectId(userId) }, { __v: 0, password: 0 }).lean()

        if (!otherUser) throw new UnexistenceError(`user with id ${otherUserId} does not exist`)

        let { following = [] } = user

        following = following.map(item => item.toString())

        const index = following.indexOf(otherUserId)

        if (index < 0) following.push(otherUserId)

        else following.splice(index, 1)

        following = following.map(item => ObjectId(item))

        await User.findByIdAndUpdate({ _id: userId }, { "following": following })
    })()
}