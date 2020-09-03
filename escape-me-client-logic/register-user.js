require('escape-me-commons/polyfills/string')
const { utils: { Email, call } } = require('escape-me-commons')
const context = require('./context')
const { errors: { DuplicityError } } = require('escape-me-commons')


/**
 * Register's a user into database
 * 
 * @param {string} name The user name. 
 * @param {string} surname The user surname.
 * @param {string} username The user username.
 * @param {string} email The user e-mail. 
 * @param {string} password The user password.
 * @returns {Promise<String>} Nothing if all has gone well, an error if it rejects.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 */
module.exports = function (name, surname, username, email, password) {
    String.validate(username)

    Email.validate(email)

    String.validate.lengthGreaterEqualThan(password, 8)

    const body = { username, email, password }
    if (name) {
        String.validate(name)
        body.name = name
    }
    if (surname) {
        String.validate(surname)
        body.surname = surname
    }

    return call(
        'POST',
        `${this.API_URL}/users`,
        JSON.stringify(body),
        { 'Content-type': 'application/json' }
    )
        .then(({ status, body }) => {

            if (status === 201) return

            const { error } = JSON.parse(body)

            throw new DuplicityError(error)
        })
}.bind(context)