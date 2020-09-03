const { searchEscapeRoom } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { params: { query }, body: { moreThanPriceMin, lessThanPriceMin, moreThanPriceMax, lessThanPriceMax, moreThanPlayersMin, lessThanPlayersMin, moreThanPlayersMax, lessThanPlayersMax, genre, difficulty, moreThanRating, lessThanRating } } = req

        searchEscapeRoom(query, { moreThanPriceMin, lessThanPriceMin, moreThanPriceMax, lessThanPriceMax, moreThanPlayersMin, lessThanPlayersMin, moreThanPlayersMax, lessThanPlayersMax, genre, difficulty, moreThanRating, lessThanRating })
            .then(results => res.send(results))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}