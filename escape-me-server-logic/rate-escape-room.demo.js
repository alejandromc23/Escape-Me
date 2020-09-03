require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const rateEscapeRoom = require('./rate-escape-room')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        await rateEscapeRoom('5eecbb104752662c101b3097', '5eecbb3739ab7a2cbbfc484f', 4)

        mongoose.disconnect()
    })