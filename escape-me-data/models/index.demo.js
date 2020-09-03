const { mongoose } = require('..')
const { User } = require('.')

mongoose.connect('mongodb://localhost/skylab')
    .then(() => User.create({ name: 'N', surname: 'S', email: 'e@mail.com', password: '123123123' }))
    .then(user => { debugger })