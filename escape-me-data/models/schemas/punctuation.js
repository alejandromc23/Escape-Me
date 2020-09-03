const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const comment = require('./comment')

module.exports = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        required: true
    },

    comment: {
        message: String,

        date: String
    }
})