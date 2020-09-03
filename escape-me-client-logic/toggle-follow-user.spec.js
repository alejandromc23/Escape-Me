require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_SECRET: SECRET, TEST_API_URL: API_URL } } = process

const toggleFollowUser = require('./toggle-follow-user')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongo } = require('escape-me-data')
const { utils: { jwtPromised } } = require('escape-me-node-commons')
const { errors: { UnexistenceError } } = require('escape-me-commons')

const bcrypt = require('bcryptjs')
const context = require('./context')
context.API_URL = API_URL
const AsyncStorage = require('not-async-storage')
context.storage = AsyncStorage

describe('logic - toggle follow user', () => {
    let users, escapeRooms

    let name, surname, username, email, password, token, hash, userId

    let _name, _surname, _username, _email, _password, _hash, _userId

    before(() => {
        return mongo.connect(MONGODB_URL)
            .then(connection => users = connection.db().collection('users'))
    })

    beforeEach(() => {
        return users.deleteMany()
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
            .then(() => {
                _name = `name-${random()}`
                _surname = `surname-${random()}`
                _username = `${name}${surname}`
                _email = `e-${random()}@mail.com`
                _password = `password-${random()}`
                _following = []

                return bcrypt.hash(password, 10)
            })
            .then(__hash => _hash = __hash)


    })

    describe('when both ids are correct', () => {

        it('should succeed on adding or deleting the id ', () => {
            return users.insertOne({ name, surname, username, email, password: hash, following })
                .then(_user => {
                    userId = _user.insertedId.toString()
                    return jwtPromised.sign({ sub: _user.insertedId.toString() }, SECRET)
                })
                .then(_token => context.storage.setItem('token', _token))
                .then(() => {
                    return users.insertOne({ _name, _surname, _username, _email, password: _hash })
                })
                .then(__user => {
                    _userId = __user.insertedId.toString()
                    return jwtPromised.sign({ sub: __user.insertedId.toString() }, SECRET)
                })
                .then(() => {
                    return toggleFollowUser(_userId)
                })
                .then(() => {
                    return users.findOne({ _id: mongo.ObjectId(userId) })
                })
                .then(__user => {
                    const { following } = __user

                    expect(following).to.exist
                    expect(following).to.be.an.instanceof(Array)
                    expect(following).to.have.lengthOf(1)
                    expect(following[0].toString()).to.equal(_userId)

                })
        })

        it('should succeed on deleting the following id ', () => {
            debugger
            return users.insertOne({ _name, _surname, _username, _email, _password: _hash })
                .then(__user => {
                    _userId = __user.insertedId.toString()
                    return jwtPromised.sign({ sub: __user.insertedId.toString() }, SECRET)
                })
                .then(() => {
                    return users.insertOne({ name, surname, username, email, password: hash, following: [mongo.ObjectId(_userId)] })
                })
                .then(_user => {
                    userId = _user.insertedId.toString()
                    return jwtPromised.sign({ sub: _user.insertedId.toString() }, SECRET)
                })
                .then(_token => context.storage.setItem('token', _token))
                .then(() => {
                    return toggleFollowUser(_userId)
                })
                .then(() => {
                    return users.findOne({ _id: mongo.ObjectId(userId) })
                })
                .then(__user => {
                    const { following } = __user

                    expect(following).to.exist
                    expect(following).to.be.an.instanceof(Array)
                    expect(following).to.have.lengthOf(0)

                })

        })
    })

    describe('if userId is wrong', () => {
        it('should fail with invalid id', async () => {
            const __user = await users.insertOne({ name, surname, username, email, password: hash })

            token = await jwtPromised.sign({ sub: __user.insertedId.toString() }, SECRET)
            await context.storage.setItem('token', token)

            const _escapeId = '5ee1fa2be1ef46672229f028'

            try {
                await toggleFollowUser('5ee1fa2be1ef46672229f028')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(UnexistenceError)
                expect(error.message).to.equal(`user with id 5ee1fa2be1ef46672229f028 does not exist`)

            }
        })
    })

    it('should fail when data inputs are wrong', async () => {
        const __user = await users.insertOne({ name, surname, username, email, password: hash })

        userId = __user.insertedId.toString()

        token = await jwtPromised.sign({ sub: userId }, SECRET)
        await context.storage.setItem('token', token)
        expect(() => {
            toggleFollowUser(1)
        }).to.throw(TypeError, '1 is not a string')
    })

    afterEach(() => users.deleteMany())

    after(mongo.disconnect)
})