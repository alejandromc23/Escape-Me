const { random, round } = Math
require('./number')

Math.randomIntegerBetween = (min, max) => {
    Number.validate.integer(min)
    Number.validate.integer(max)
    Number.validate.greaterEqualThan(max, min)

    return round((max - min) * random()) + min
}