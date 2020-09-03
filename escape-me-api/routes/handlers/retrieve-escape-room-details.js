const { retrieveEscapeRoomDetails } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { params: { escapeId } } = req

        retrieveEscapeRoomDetails(escapeId)
            .then(escape => res.send(escape))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}