const { searchUsers } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { payload: { sub: userId }, params: { query } } = req

        searchUsers(userId, query)
            .then(results => res.send(results))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}