require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const registerUser = require('./register-user')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongoose, models: { User } } = require('escape-me-data')
const bcrypt = require('bcryptjs')
const { errors: { DuplicityError, VoidError } } = require('escape-me-commons')

describe('logic - register user', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let name, surname, username, email, password

    beforeEach(async () => {
        await User.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `${name}${surname}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on valid data using all the fields', async () => {
        const result = await registerUser(name, surname, username, email, password)

        expect(result).to.be.undefined

        const users = await User.find()

        expect(users.length).to.equal(1)

        const [user] = users

        expect(user.name).to.equal(name)
        expect(user.surname).to.equal(surname)
        expect(user.username).to.equal(username)
        expect(user.email).to.equal(email)

        const match = await bcrypt.compare(password, user.password)

        expect(match).to.be.true
    })

    it('should succeed on valid data without providing a name', async () => {
        const result = await registerUser(undefined, surname, username, email, password)

        expect(result).to.be.undefined

        const users = await User.find()

        expect(users.length).to.equal(1)

        const [user] = users

        expect(user.name).to.be.undefined
        expect(user.surname).to.equal(surname)
        expect(user.username).to.equal(username)
        expect(user.email).to.equal(email)

        const match = await bcrypt.compare(password, user.password)

        expect(match).to.be.true
    })

    it('should succeed on valid data without providing a surname', async () => {
        const result = await registerUser(name, undefined, username, email, password)

        expect(result).to.be.undefined

        const users = await User.find()

        expect(users.length).to.equal(1)

        const [user] = users

        expect(user.name).to.equal(name)
        expect(user.surname).to.be.undefined
        expect(user.username).to.equal(username)
        expect(user.email).to.equal(email)

        const match = await bcrypt.compare(password, user.password)

        expect(match).to.be.true
    })

    describe('when user already exists', () => {
        beforeEach(() => User.create({ name, surname, username, email, password }))

        it('should fail on trying to register an existing user', async () => {
            try {
                await registerUser(name, surname, username, `a${random()}@mail.com`, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(DuplicityError)
                expect(error.message).to.equal(`user with email or username provided already exists`)
            }

            try {
                await registerUser(name, surname, `${random()}`, email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(DuplicityError)
                expect(error.message).to.equal(`user with email or username provided already exists`)
            }
        })
    })

    describe('when data inputs are not in the correct format', () => {
        it('should fail validating incorrect inputs', () => {
            expect(() => {
                registerUser(1, surname, username, email, password)
            }).to.throw(TypeError, '1 is not a string')

            expect(() => {
                registerUser(name, surname, 1, email, password)
            }).to.throw(TypeError, '1 is not a string')

            expect(() => {
                registerUser(name, 1, username, email, password)
            }).to.throw(TypeError, '1 is not a string')

            expect(() => {
                registerUser(name, surname, username, 'amai.com', password)
            }).to.throw(Error, 'amai.com is not an e-mail')

            expect(() => {
                registerUser(name, surname, username, email, 1)
            }).to.throw(TypeError, '1 is not a string')

        })
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})