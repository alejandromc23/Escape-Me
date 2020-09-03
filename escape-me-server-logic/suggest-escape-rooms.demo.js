require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const suggestEscapeRooms = require('./suggest-escape-rooms')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        const result = await suggestEscapeRooms('5ee8d5948d0a6254ae706464')

        console.log(result.length)
        mongoose.disconnect()
    })
    .catch(console.log)

