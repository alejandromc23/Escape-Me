const { retrieveFollowing } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { payload: { sub: userId }, params: { userId: otherUserId } } = req

        retrieveFollowing(otherUserId || userId)
            .then(following => res.send(following))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}