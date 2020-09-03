const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const Email = {
    isEmail(email) {
        return EMAIL_REGEX.test(email)
    }
}

Email.validate = function (email) {
    if (!this.isEmail(email)) throw new Error(`${email} is not an e-mail`)
}.bind(Email)


module.exports = Email