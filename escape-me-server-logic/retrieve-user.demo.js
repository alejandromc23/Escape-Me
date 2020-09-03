require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const retrieveUser = require('./retrieve-user')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        const user = await retrieveUser('5edf807d0905cc4924c1a2e0')

        console.log(user)
    })