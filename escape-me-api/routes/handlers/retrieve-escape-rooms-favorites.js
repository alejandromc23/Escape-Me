const { retrieveEscapeRooms } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        debugger
        const { payload: { sub: userId }, params: { userId: otherUserId } } = req

        retrieveEscapeRooms(otherUserId || userId, 'favorites')
            .then(favorites => res.send(favorites))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}