const { registerUser } = require('escape-me-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    const { body: { name, surname, username, email, password } } = req

    try {
        registerUser(name, surname, username, email, password)
            .then(() => res.status(201).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}