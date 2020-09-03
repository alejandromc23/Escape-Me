const { errors: { CredentialsError, UnexistenceError }, utils: { Email } } = require("escape-me-commons")

require("escape-me-commons/polyfills/string")
const { models: { User } } = require('escape-me-data')
const bcrypt = require('bcryptjs')

/**
 * Checks user credentials.
 * 
 * @param {string} email The user e-mail. 
 * @param {string} password The user password.
 * 
 * @returns {Promise<String>} The user id, an error if it rejects.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {Error} If e-mail does not match the expected format.
 */
module.exports = (email, password) => {
    String.validate.notVoid(email)
    Email.validate(email)
    String.validate.notVoid(password)

    return (async () => {
        const user = await User.findOne({ email })

        if (!user) throw new UnexistenceError(`user with e-mail ${email} does not exist`)

        const match = await bcrypt.compare(password, user.password);

        if (!match) throw new CredentialsError('wrong password')

        return user._id.toString()
    })()
} 