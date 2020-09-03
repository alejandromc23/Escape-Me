require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL } } = process

const registerUser = require('./register-user')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongo } = require('escape-me-data')
const { errors: { DuplicityError } } = require('escape-me-commons')
const bcrypt = require('bcryptjs')
require('escape-me-commons/ponyfills/xhr')


describe('logic - register user', () => {
    let users

    before(() =>
        mongo.connect(MONGODB_URL)
            .then(connection => users = connection.db().collection('users'))
    )

    let name, surname, email, password, username

    beforeEach(() =>
        users.deleteMany()
            .then(() => {
                name = `name-${random()}`
                surname = `surname-${random()}`
                username = `${name}${surname}`
                email = `e-${random()}@mail.com`
                password = `password-${random()}`
            })
    )

    it('should succeed on valid data', () =>
        registerUser(name, surname, username, email, password)
            .then(() => users.find().toArray())
            .then(_users => {
                debugger
                expect(_users.length).to.equal(1)

                const [user] = _users

                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user['participated']).to.be.an.instanceOf(Array)
                expect(user['pending']).to.be.an.instanceOf(Array)
                expect(user['favorites']).to.be.an.instanceOf(Array)
                expect(user['following']).to.be.an.instanceOf(Array)
                expect(user['participated'].length).to.equal(0)
                expect(user['pending'].length).to.equal(0)
                expect(user['favorites'].length).to.equal(0)
                expect(user['following'].length).to.equal(0)


                return bcrypt.compare(password, user.password)
            })
            .then(match => expect(match).to.be.true)
    )

    it('should succeed on valid data without name', () =>
        registerUser(undefined, surname, username, email, password)
            .then(() => users.find().toArray())
            .then(_users => {
                debugger
                expect(_users.length).to.equal(1)

                const [user] = _users

                expect(user.name).to.be.undefined
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user['participated']).to.be.an.instanceOf(Array)
                expect(user['pending']).to.be.an.instanceOf(Array)
                expect(user['favorites']).to.be.an.instanceOf(Array)
                expect(user['following']).to.be.an.instanceOf(Array)
                expect(user['participated'].length).to.equal(0)
                expect(user['pending'].length).to.equal(0)
                expect(user['favorites'].length).to.equal(0)
                expect(user['following'].length).to.equal(0)

                return bcrypt.compare(password, user.password)
            })
            .then(match => expect(match).to.be.true)
    )

    it('should succeed on valid data without surname', () =>
        registerUser(name, undefined, username, email, password)
            .then(() => users.find().toArray())
            .then(_users => {
                debugger
                expect(_users.length).to.equal(1)

                const [user] = _users

                expect(user.name).to.equal(name)
                expect(user.surname).to.be.undefined
                expect(user.email).to.equal(email)
                expect(user['participated']).to.be.an.instanceOf(Array)
                expect(user['pending']).to.be.an.instanceOf(Array)
                expect(user['favorites']).to.be.an.instanceOf(Array)
                expect(user['following']).to.be.an.instanceOf(Array)
                expect(user['participated'].length).to.equal(0)
                expect(user['pending'].length).to.equal(0)
                expect(user['favorites'].length).to.equal(0)
                expect(user['following'].length).to.equal(0)

                return bcrypt.compare(password, user.password)
            })
            .then(match => expect(match).to.be.true)
    )

    describe('when user already exists', () => {
        beforeEach(() => users.insertOne({ name, surname, username, email, password }))

        it('should fail on trying to register an existing user', () =>
            registerUser(name, surname, username, email, password)
                .then(() => { throw new Error('should not reach this point') })
                .catch(error => {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceof(DuplicityError)
                    expect(error.message).to.equal(`user with email or username provided already exists`)
                })
        )
    })

    it('should fail when inputs are incorrect', () => {
        expect(() => {
            registerUser(1, surname, username, email, password)
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            registerUser(name, 1, username, email, password)
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            registerUser(name, surname, 1, email, password)
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            registerUser(name, surname, username, 'amail.com', password)
        }).to.throw(Error, 'amail.com is not an e-mail')

        expect(() => {
            registerUser(name, surname, username, email, '123')
        }).to.throw(Error, 'length is not greater or equal than 8')
    })

    afterEach(() => users.deleteMany())

    after(mongo.disconnect)
})