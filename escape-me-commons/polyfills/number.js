const { ValueError } = require('../errors')

Number.isNumber = function (number) {
    return typeof number !== 'boolean' && !isNaN(number)
}

Number.validate = function (number) {
    if (!this.isNumber(number)) throw new TypeError(`${number} is not a number`)
}

Number.validate.positive = function (number) {
    this.validate(number)

    if (number < 0) throw new ValueError(`${number} is not a positive number`)
}.bind(Number)

Number.validate.integer = function (number) {
    this.validate(number)

    if (!this.isInteger(number)) throw new ValueError(`${number} is not an integer number`)
}.bind(Number)

Number.validate.greaterEqualThan = function (number, other) {
    this.validate(number)
    this.validate(other)

    if (number < other) throw new ValueError(`${number} is not greater or equal than ${other}`)
}.bind(Number)