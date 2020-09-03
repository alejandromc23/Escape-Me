const { model } = require('mongoose')
const { user, punctuation, escapeRoom, comment } = require('./schemas')

module.exports = {
    User: model('User', user),
    Punctuation: model('Punctuation', punctuation),
    EscapeRoom: model('EscapeRoom', escapeRoom),
    Comment: model('Comment', comment)
}