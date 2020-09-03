require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const toggleEscapeRoom = require('./toggle-escape-room')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        await toggleEscapeRoom("5ee1fa2be1ef46672229f028", "5ee1f76662e60c60f97b002f", 'pending')
        await toggleEscapeRoom("5ee1fa2be1ef46672229f028", "5ee1f76662e60c60f97b002f", 'participated')
        await toggleEscapeRoom("5ee1fa2be1ef46672229f028", "5ee1f76662e60c60f97b002f", 'favorites')

        await mongoose.disconnect()
    })
    .catch(console.log)