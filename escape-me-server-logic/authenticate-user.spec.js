require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const authenticateUser = require('./authenticate-user')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongoose, models: { User } } = require('escape-me-data')
const bcrypt = require('bcryptjs')

describe('logic - authenticate user', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let name, surname, email, password, userId, hash, username

    beforeEach(async () => {
        await User.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `${name}${surname}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`

        hash = await bcrypt.hash(password, 10)
    }
    )

    describe('when user already exists', () => {
        beforeEach(async () => {
            const _user = await User.create({ name, surname, username, email, password: hash })
            userId = _user.id
        }
        )

        it('should succeed on correct credentials', async () => {
            const _userId = await authenticateUser(email, password)
            expect(_userId).to.equal(userId)
        }
        )

        it('should fail on wrong password', async () => {
            password += 'wrong-'
            try {
                await authenticateUser(email, password)
                throw new Error('should not reach this point')

            } catch (error) {
                expect(error).to.be.an.instanceof(Error)
                expect(error.message).to.equal(`wrong password`)
            }
        })
    })

    it('should fail when user does not exist', async () => {
        const _email = `a${random()}@mail.com`
        try {
            await authenticateUser(_email, password)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`user with e-mail ${_email} does not exist`)
        }
    })

    it('should fail if the inputs introduced are wrong', () => {

        expect(() => {
            authenticateUser('amail.com', '123123123')
        }).to.throw(Error, 'amail.com is not an e-mail')

        expect(() => {
            authenticateUser('a@mail.com', 1)
        }).to.throw(Error, '1 is not a string')

        expect(() => {
            authenticateUser(1, '123123123')
        }).to.throw(Error, '1 is not a string')
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})