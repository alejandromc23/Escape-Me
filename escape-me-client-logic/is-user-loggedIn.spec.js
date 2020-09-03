require('dotenv').config()
const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_SECRET: SECRET, TEST_API_URL: API_URL } } = process

const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongoose, models: { User } } = require('escape-me-data')
require('escape-me-commons/ponyfills/xhr')
global.fetch = require('node-fetch')
const { utils: { jwtPromised } } = require('escape-me-node-commons')
const context = require('./context')
const bcrypt = require('bcryptjs')
const isUserLoggedIn = require('./is-user-loggedIn')

const AsyncStorage = require('not-async-storage')
context.storage = AsyncStorage
context.API_URL = API_URL


describe('client - is user authenticated', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let name, surname, email, password, token, hash, userId

    beforeEach(async () => {
        await User.deleteMany()
            .then(async () => {
                name = `name-${random()}`;
                surname = `surname-${random()}`;
                username = `${name}${surname}`
                email = `email-${random()}@gmail.com`;
                password = `password-${random()}`;
                hash = await bcrypt.hash(password, 10);
            })
    })

    describe('when user already exists', () => {
        beforeEach(async () => {
            await User.create({ name, surname, username, email, password: hash })
                .then(({ id }) => {
                    userId = id
                })

            token = await jwtPromised.sign({ sub: userId }, SECRET)
            await context.storage.setItem('token', token)
        })

        it('should succeed on user logged in', () =>
            isUserLoggedIn()
                .then(result => {
                    expect(result).to.equal(true)
                })
        )
    })

    describe('when user is not authenticated', () => {

        beforeEach(async () => {
            await context.storage.removeItem('token')
        })

        it('should fail when user is not authenticated', () =>
            isUserLoggedIn()
                .then(result => {
                    expect(result).to.equal(false)
                })
        )
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})