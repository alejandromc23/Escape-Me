require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_SECRET: SECRET, TEST_API_URL: API_URL } } = process

const retrieveFollowing = require('./retrieve-following')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongo } = require('escape-me-data')
require('escape-me-commons/ponyfills/xhr')
const { utils: { jwtPromised } } = require('escape-me-node-commons')
const bcrypt = require('bcryptjs')

const context = require('./context')
context.API_URL = API_URL
const logic = require('.')
const AsyncStorage = require('not-async-storage')
logic.__context__.storage = AsyncStorage


describe('logic - retrieve following', () => {
    let users

    before(() =>
        mongo.connect(MONGODB_URL)
            .then(connection => users = connection.db().collection('users'))
    )

    let name, surname, email, password, token

    beforeEach(() =>
        users.deleteMany()
            .then(() => {
                name = `name-${random()}`
                surname = `surname-${random()}`
                username = `${name}${surname}`
                email = `e-${random()}@mail.com`
                password = `password-${random()}`
                following = []

                return bcrypt.hash(password, 10)
            })
            .then(_hash => hash = _hash)
    )

    describe('when user already exists', () => {
        beforeEach(() =>
            users.insertOne({ name, surname, email, username, password: hash, following })
                .then(_user => jwtPromised.sign({ sub: _user.insertedId.toString() }, SECRET))
                .then(_token => context.storage.setItem('token', _token))
        )

        it('should succeed on correct user id', () =>
            retrieveFollowing()
                .then(list => {
                    expect(list).to.be.an.instanceOf(Array)
                    expect(list).to.have.lengthOf(0)
                })
        )

        it('should succeed on retrieving other user', () => {
            name = `name-${random()}`
            surname = `surname-${random()}`
            username = `${name}${surname}`
            email = `e-${random()}@mail.com`
            password = `password-${random()}`
            following = []

            return bcrypt.hash(password, 10)
                .then(_hash => hash = _hash)
                .then(() => users.insertOne({ name, surname, email, username, password: hash, following }))
                .then(_user => userId = _user.insertedId.toString())
                .then(() => retrieveFollowing(userId))
                .then(list => {
                    expect(list).to.be.an.instanceOf(Array)
                    expect(list).to.have.lengthOf(0)
                })
        })
    })

    describe('when user does not exist', () => {
        let userId

        beforeEach(() => {
            userId = '5ed1204ee99ccf6fae798aef'

            return jwtPromised.sign({ sub: userId }, SECRET)
                .then(_token => context.storage.setItem('token', _token))
        })

        it('should fail when user does not exist', () =>
            retrieveFollowing(token)
                .then(() => { throw new Error('should not reach this point') })
                .catch(error => {
                    expect(error).to.exist
                    expect(error).to.be.an.instanceof(Error)
                    expect(error.message).to.equal(`user with id ${userId} does not exist`)
                })
        )
    })

    afterEach(() => users.deleteMany())

    after(mongo.disconnect)
})