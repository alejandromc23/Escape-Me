const { VoidError } = require('../errors')

const ALPHABETIC_REGEX = /^[a-zA-Z ]+$/

String.isString = function (string) {
    return typeof string === 'string'
}

String.isVoid = function (string) {
    this.validate(string)

    return !string.trim().length
}

String.isAlphabetic = function (string) {
    this.validate(string)

    return ALPHABETIC_REGEX.test(string)
}

String.isLengthGreaterEqualThan = function (string, length) {
    this.validate(string)

    return string.length >= length
}

String.validate = function (string) {
    if (!this.isString(string)) throw new TypeError(`${string} is not a string`)
}

String.validate.notVoid = function (string) {
    if (this.isVoid(string)) throw new VoidError(`string is empty or blank`)
}.bind(String)

String.validate.alphabetic = function (string) {
    if (!this.isAlphabetic(string)) throw new Error(`${string} is not alphabetic`)
}.bind(String)

String.validate.lengthGreaterEqualThan = function (string, length) {
    if (!this.isLengthGreaterEqualThan(string, length)) throw new Error(`length is not greater or equal than ${length}`)
}.bind(String)