require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const toggleFollowUser = require('./toggle-follow-user')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        await toggleFollowUser("5ee2407bfa1e1c4323b04530", "5ee2409afa1e1c4323b04531", 'favorites')

        await mongoose.disconnect()
    })
    .catch(console.log)