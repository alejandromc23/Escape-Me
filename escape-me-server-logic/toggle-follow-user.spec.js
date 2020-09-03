require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const toggleFollowUser = require('./toggle-follow-user')
const { random } = Math
const { expect } = require('chai')

const { mongoose, models: { User } } = require('escape-me-data')
const { errors: { UnexistenceError } } = require('escape-me-commons')
const bcrypt = require('bcryptjs')

describe('logic - toggle follow user', () => {
    before(() => {
        return mongoose.connect(MONGODB_URL)
    })

    let name, surname, username, email, password, hash, userId
    let _name, _surname, _username, _email, _password, _hash, _userId

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

    })

    describe('when userId escapeId and tag are correct', () => {

        it('should succeed on adding the id of following ', async () => {
            const _user = await User.create({ name, surname, username, email, password: hash })
            userId = _user.id

            const __user = await User.create({ name: _name, surname: _surname, username: _username, email: _email, password: _hash })
            _userId = __user.id

            await toggleFollowUser(userId, _userId)

            const ___user = await User.findOne(mongoose.ObjectId(userId))

            const { following } = ___user

            expect(following).to.exist
            expect(following).to.be.an.instanceof(Array)
            expect(following).to.have.lengthOf(1)
            expect(following[0].toString()).to.equal(_userId)
        })

        it('should succeed on deleting the id of following ', async () => {
            const __user = await User.create({ name: _name, surname: _surname, username: _username, email: _email, password: _hash })
            _userId = __user.id

            const _user = await User.create({ name, surname, username, email, password: hash, following: [_userId] })
            userId = _user.id

            await toggleFollowUser(userId, _userId)

            const ___user = await User.findOne(mongoose.ObjectId(userId))

            const { following } = ___user

            expect(following).to.exist
            expect(following).to.be.an.instanceof(Array)
            expect(following).to.have.lengthOf(0)

        })
    })

    describe('if userId or otherUserId are wrong', () => {
        it('should fail when user does not exist', async () => {
            const userId = '5ee1fa2be1ef46672229f028'
            const __user = await User.create({ name: _name, surname: _surname, username: _username, email: _email, password: _hash })
            _userId = __user.id

            try {
                const user = await toggleFollowUser(userId, userId)
                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(UnexistenceError)
                expect(error.message).to.equal(`user with id ${userId} does not exist`)
            }
        })
    })

    it('should fail when data inputs are wrong', async () => {
        const __user = await User.create({ name: _name, surname: _surname, username: _username, email: _email, password: _hash })
        _userId = __user.id
        expect(() => {
            toggleFollowUser(1, _userId)
        }).to.throw(TypeError, '1 is not a string')

        const _user = await User.create({ name, surname, username, email, password: hash })
        userId = _user.id

        expect(() => {
            toggleFollowUser(userId, 1)
        }).to.throw(TypeError, '1 is not a string')
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})