require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const searchUsers = require('./search-users')
const { expect } = require('chai')
const { random } = Math
require('escape-me-commons/polyfills/json')
const { mongoose, models: { User } } = require('escape-me-data')
const { errors: { UnexistenceError } } = require('escape-me-commons')
const bcrypt = require('bcryptjs')

describe('logic - search users', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let name, surname, username, email, password, hash, result, userId
    let _name, _surname, _username, _email, _password, _hash

    beforeEach(async () => {
        await User.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `${name}${surname}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, 10)

        _name = `name-${random()}`
        _surname = `surname-${random()}`
        _username = `${name}${surname}`
        _email = `e-${random()}@mail.com`
        _password = `password-${random()}`
        _hash = await bcrypt.hash(password, 10)
    }
    )

    describe('when values introduced are correct', () => {
        beforeEach(async () => {
            await User.create({ name: _name, surname: _surname, username: _username, email: _email, password: _hash })
            const user_ = await User.create({ name, surname, username, email, password: hash })
            userId = user_.id
        }
        )
        it('should succeed on retrieving data', async () => {
            result = await searchUsers(userId, _name)

            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(1)
            expect(result[0].name).to.equal(_name)
            expect(result[0].surname).to.equal(_surname)
            expect(result[0].username).to.equal(_username)
            expect(result[0].password).to.be.undefined

            result = await searchUsers(userId, _surname)

            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(1)
            expect(result[0].name).to.equal(_name)
            expect(result[0].surname).to.equal(_surname)
            expect(result[0].username).to.equal(_username)
            expect(result[0].password).to.be.undefined

            result = await searchUsers(userId, _username)

            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(1)
            expect(result[0].name).to.equal(_name)
            expect(result[0].surname).to.equal(_surname)
            expect(result[0].username).to.equal(_username)
            expect(result[0].password).to.be.undefined
        }
        )
        it('should retrieve an empty array if the match does not exist', async () => {
            result = await searchUsers(userId, 'fdsdfssdf')

            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(0)
        })
    })

    it('should fail when user does not exist', async () => {
        const _userId = '5ed1204ee99ccf6fae798aef'

        try {
            const result = await searchUsers(_userId, 'x')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(UnexistenceError)
            expect(error.message).to.equal(`user with id ${_userId} does not exist`)

        }
    })

    it('should fail if inputs introduced are wrong ', async () => {
        await User.create({ name: _name, surname: _surname, username: _username, email: _email, password: _hash })
        const user_ = await User.create({ name, surname, username, email, password: hash })
        userId = user_.id

        expect(() => {
            searchUsers(userId, 1)
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            searchUsers(1, 'name')
        }).to.throw(TypeError, '1 is not a string')
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})