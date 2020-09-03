require('escape-me-commons/polyfills/string')
require('escape-me-commons/polyfills/number')
require('escape-me-commons/polyfills/json')
const { errors: { UnexistenceError } } = require('escape-me-commons')
const { models: { User, EscapeRoom }, mongoose: { ObjectId } } = require('escape-me-data')

/**
 * Suggests potential favorites escape rooms.
 * @param {String} userId The id of a user.
 * @returns {Promise<Array>} An array of Objects, if not returns an error.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = (userId) => {
    if (userId) String.validate.notVoid(userId)

    return (async () => {
        let sorteable = []
        let index = 0
        let escapesSuggested = []
        let escapeRooms

        if (userId) {
            const genres = {}

            const user = await User.findOne({ _id: ObjectId(userId) }, {
                __v: 0, password: 0, following: 0, name: 0,
                surname: 0, email: 0, username: 0, _id: 0, pending: 0
            }).populate('participated').populate('pending').populate('favorites').lean()

            if (!user) throw new UnexistenceError(`user with id ${userId} does not exist`)

            const _user = await User.findOne({ _id: ObjectId(userId) }, {
                __v: 0, password: 0, following: 0, name: 0,
                surname: 0, email: 0, username: 0, _id: 0
            }).lean()

            let __user = {}

            Object.keys(_user).forEach(item => __user[item] = _user[item].map(_item => _item.toString()))

            Object.keys(user).forEach(item => {
                user[item].forEach(({ genre }) => {
                    if (genres[genre]) genres[genre] = genres[genre] + 1
                    else genres[genre] = 1
                })
            })

            Object.keys(genres).forEach(genre => {
                sorteable.push([genre, genres[genre]])
            })

            sorteable.sort((a, b) => b[1] - a[1])
            if (sorteable.length > 3) sorteable = sorteable.slice(0, 3)

            while (index !== sorteable.length) {
                escapeRooms = await EscapeRoom.find({ genre: sorteable[index][0] }).lean()

                escapeRooms.forEach(escape => {
                    if ((!__user['participated'].includes(escape._id.toString())) && (!__user['pending'].includes(escape._id.toString())) && (!__user['favorites'].includes(escape._id.toString()))) {
                        escapesSuggested.push(escape)
                    }
                })

                index++
            }
        }

        if (escapesSuggested.length === 0) {
            escapeRooms = await EscapeRoom.find({}).lean()
            escapeRooms.sort(() => 0.5 - Math.random())

            while (escapesSuggested.length < 10 && escapesSuggested < escapeRooms.length) {
                escapeRooms.forEach(escape => {
                    if (escapesSuggested.length < 10) escapesSuggested.push(escape)
                })
            }

        }

        escapesSuggested = escapesSuggested.map(({ _id, name, priceMin, priceMax, playersMin, playersMax, genre, city, image, rating }) => ({ id: _id, name, priceMin, priceMax, playersMin, playersMax, genre, city, image, rating }))

        escapesSuggested.sort(() => 0.5 - Math.random())

        escapesSuggested = escapesSuggested.slice(0, 10)

        return escapesSuggested
    })()
}
