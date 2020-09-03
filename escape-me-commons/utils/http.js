require('../polyfills/string')

module.exports = (() => {
    const methods = [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'DELETE',
        'CONNECT',
        'OPTIONS',
        'TRACE',
        'PATCH'
    ]

    const http = {
        isMethod(method) {
            String.validate(method)

            return methods.includes(method)
        },

        validateMethod(method) {
            if (!this.isMethod(method)) throw new Error(`${method} is not an HTTP method`)
        }
    }

    for (const method of methods)
        http[method] = method

    return http
})()

