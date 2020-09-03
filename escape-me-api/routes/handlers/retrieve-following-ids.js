const { retrieveFollowingIds } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { payload: { sub: userId }, params: { userId: otherUserId } } = req

        retrieveFollowingIds(otherUserId || userId)
            .then(user => res.send(user))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}