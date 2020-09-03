const { Schema } = require('mongoose')

module.exports = new Schema({
    message: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    }
})