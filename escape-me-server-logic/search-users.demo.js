require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const searchUsers = require('./search-users')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        const result = await searchUsers('5ee3a419fdf5756ee2c70a97', 'ale')

        console.log(result)
        mongoose.disconnect()
    })
    .catch(console.log)

    // genre: ['terror', 'aventuras'], difficulty: [2, 3], moreThanPlayersMax: 6, moreThanPriceMax: 95, lessThanPriceMin: 20