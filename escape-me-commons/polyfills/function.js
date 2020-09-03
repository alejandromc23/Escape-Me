Function.isFunction = function (func) {
    return typeof func === 'function'
}

Function.validate = function (func) {
    if (!this.isFunction(func)) throw new TypeError(`${func} is not a function`)
}