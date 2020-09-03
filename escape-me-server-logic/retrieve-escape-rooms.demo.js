require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const retrieveEscapeRooms = require('./retrieve-escape-rooms')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        const user = await retrieveEscapeRooms('5ee3856f48590e563271360d', 'pending')

        console.log(user)
    })