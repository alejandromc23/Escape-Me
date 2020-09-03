const Http = require('./http')
require('../polyfills/url')
require('../polyfills/function')

module.exports = function (method, url, body, headers, callback) {
    Http.validateMethod(method)
    URL.validate(url)

    if (arguments.length > 4)
        Function.validate(callback)

    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, url)

        if (headers)
            for (const key in headers)
                xhr.setRequestHeader(key, headers[key])

        xhr.onload = function () {
            resolve({ status: this.status, body: this.responseText })
        }

        xhr.onerror = function () {
            reject(new Error('network error'))
        }

        xhr.send(body ? body : undefined)
    })

    if (arguments.length < 5) return promise

    promise
        .then(({ status, body }) => callback(null, status, body))
        .catch(callback)
}
