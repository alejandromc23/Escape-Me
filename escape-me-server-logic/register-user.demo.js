require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const { mongoose } = require('../escape-me-data')

const registerUser = require('./register-user')

mongoose.connect(MONGODB_URL)
    .then(() => {
        return registerUser('alejandro', 'mc', 'alejandromc23', 'alejandro@mail.com', '123123123')
            .then(() => console.log('Registered'))
    })