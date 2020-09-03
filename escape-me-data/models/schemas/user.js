const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const { utils: { Email } } = require('escape-me-commons')
require('escape-me-commons/polyfills/url')

module.exports = new Schema({
    name: String,

    surname: String,

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: [Email.validate, 'invalid e-mail']
    },

    password: {
        type: String,
        required: true
    },

    participated: [{ type: ObjectId, required: true, ref: 'EscapeRoom' }],

    pending: [{ type: ObjectId, required: true, ref: 'EscapeRoom' }],

    favorites: [{ type: ObjectId, required: true, ref: 'EscapeRoom' }],

    following: [{ type: ObjectId, required: true, ref: 'User' }],

    image: String
})