global.XMLHttpRequest = require('xhr2')

const rateEscapeRoom = require('./rate-escape-room');

(async () => {
    await rateEscapeRoom('5eece58af009e203cc7f6537', 4)
})()