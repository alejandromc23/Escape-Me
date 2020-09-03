const { retrieveEscapeRooms } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        debugger
        const { payload: { sub: userId }, params: { userId: otherUserId } } = req

        retrieveEscapeRooms(otherUserId || userId, 'participated')
            .then(participated => res.send(participated))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}