require('dotenv').config()

const { mongoose } = require('escape-me-data')
const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const searchEscapeRoom = require('./search-escape-room')

mongoose.connect(MONGODB_URL)
    .then(async () => {
        const result = await searchEscapeRoom('i', { genre: ['terror', 'aventuras'], difficulty: [2, 3], moreThanPlayersMax: 6, moreThanPriceMax: 95 })

        console.log(result)
        mongoose.disconnect()
    })
    .catch(console.log)

    // genre: ['terror', 'aventuras'], difficulty: [2, 3], moreThanPlayersMax: 6, moreThanPriceMax: 95, lessThanPriceMin: 20