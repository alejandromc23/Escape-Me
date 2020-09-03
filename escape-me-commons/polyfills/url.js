URL.isUrl = function (url) {
    try {
        new URL(url)

        return true
    } catch (error) {
        return false
    }
}

URL.validate = function (url) {
    if (!this.isUrl(url)) throw new Error(`${url} is not a url`)
}.bind(URL)