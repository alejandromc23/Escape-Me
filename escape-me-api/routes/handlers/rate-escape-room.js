const { rateEscapeRoom } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { payload: { sub: userId }, body: { escapeId, rating } } = req

        rateEscapeRoom(userId, escapeId, rating)
            .then(() => res.status(204).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}