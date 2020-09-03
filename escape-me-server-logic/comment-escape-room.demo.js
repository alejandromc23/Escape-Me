require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const commentEscapeRoom = require('./comment-escape-room')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        await commentEscapeRoom('5eecbb104752662c101b3097', '5eecbb3739ab7a2cbbfc484f', 'Nuuuu')

        mongoose.disconnect()
    })