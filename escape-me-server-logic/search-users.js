require('escape-me-commons/polyfills/string')
require('escape-me-commons/polyfills/number')
require('escape-me-commons/polyfills/json')
const { errors: { UnexistenceError } } = require('escape-me-commons')
const { models: { User }, mongoose: { ObjectId } } = require('escape-me-data')

/**
 * Search users.
 * @param {String} userId The id of a user.
 * @param {String} query The query searched.
 * 
 * @returns {Promise<Array>} An array of Objects, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = (userId, query) => {
    String.validate.notVoid(userId)
    String.validate.notVoid(query)

    query = query.toLowerCase()

    return (async () => {
        const _user = await User.findOne({ _id: ObjectId(userId) }, { __v: 0, password: 0 }).lean()

        if (!_user) throw new UnexistenceError(`user with id ${userId} does not exist`)

        let user = await User.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: query } },
                        { name: { $regex: query } },
                        { surname: { $regex: query } },
                    ]
                },
                { _id: { $ne: userId } }
            ]
        }, { __v: 0, password: 0, pending: 0, participated: 0, favorites: 0, following: 0, email: 0 }).lean()

        user = user.map(({ _id, name, surname, username }) => ({ id: _id, name, surname, username }))

        return user
    })()
}