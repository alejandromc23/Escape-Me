require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL } } = process

const loginUser = require('./login-user')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongo } = require('escape-me-data')
const bcrypt = require('bcryptjs')
require('escape-me-commons/ponyfills/xhr')
require('escape-me-commons/ponyfills/atob')
const context = require('./context')
context.API_URL = API_URL
const AsyncStorage = require('not-async-storage')
context.storage = AsyncStorage


describe('logic - authenticate user', () => {
    let users

    before(() =>
        mongo.connect(MONGODB_URL)
            .then(connection => users = connection.db().collection('users'))
    )

    let name, surname, email, password, userId, participated, following, pending, favorites

    beforeEach(() =>
        users.deleteMany()
            .then(() => {
                name = `name-${random()}`
                surname = `surname-${random()}`
                username = `${name}${surname}`
                email = `e-${random()}@mail.com`
                password = `password-${random()}`
                participated = []
                following = []
                pending = []
                favorites = []

                return bcrypt.hash(password, 10)
            })
            .then(_hash => hash = _hash)
    )

    describe('when user already exists', () => {
        beforeEach(() =>
            users.insertOne({ name, surname, email, password: hash, participated, following, pending, favorites })
                .then(user => userId = user.insertedId.toString())
        )

        it('should succeed on correct credentials', () =>
            loginUser(email, password)
                .then(() => {
                    let token

                    (async () => {
                        const token = await context.storage.getItem('token')

                        const [, payloadBase64] = token.split('.')

                        const payloadJson = atob(payloadBase64)

                        const payload = JSON.parse(payloadJson)

                        const { sub: _userId } = payload

                        expect(_userId).to.equal(userId)
                    })()

                })
        )

        it('should fail on wrong password', () => {
            password += 'wrong-'

            return loginUser(email, password)
                .then(() => { throw new Error('should not reach this point') })
                .catch(error => {
                    expect(error).to.be.an.instanceof(Error)
                    expect(error.message).to.equal(`wrong password`)
                })
        })
    })

    it('should fail when user does not exist', () =>
        loginUser(email, password)
            .then(() => { throw new Error('should not reach this point') })
            .catch(error => {
                expect(error).to.be.an.instanceof(Error)
                expect(error.message).to.equal(`user with e-mail ${email} does not exist`)
            })
    )

    it('should fail when inputs are incorrect', () => {
        expect(() => {
            loginUser(email, 1)
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            loginUser(email, true)
        }).to.throw(TypeError, 'true is not a string')

        expect(() => {
            loginUser('amail.com', password)
        }).to.throw(Error, 'amail.com is not an e-mail')

        expect(() => {
            loginUser(true, password)
        }).to.throw(Error, 'true is not an e-mail')

    })

    afterEach(() => users.deleteMany())

    after(mongo.disconnect)
})