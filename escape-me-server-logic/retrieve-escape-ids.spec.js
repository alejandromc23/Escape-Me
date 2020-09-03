require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const retrieveEscapeIds = require('./retrieve-escape-ids')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongoose, models: { User } } = require('escape-me-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve escape ids', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let name, surname, email, password, userId, username

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

        it('should succeed on correct user id', async () => {
            const user = await retrieveEscapeIds(userId)
            expect(user['participated']).to.be.an.instanceOf(Array)
            expect(user['participated']).to.have.lengthOf(0)
            expect(user['favorites']).to.be.an.instanceOf(Array)
            expect(user['favorites']).to.have.lengthOf(0)
            expect(user['pending']).to.be.an.instanceOf(Array)
            expect(user['pending']).to.have.lengthOf(0)
        }
        )
    })

    it('should fail when user does not exist', async () => {
        const userId = '5ed1204ee99ccf6fae798aef'

        try {
            const user = await retrieveEscapeIds(userId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`user with id ${userId} does not exist`)

        }
    })

    it('should fail if id is not a string', async () => {
        const userId = 1

        expect(() => {
            retrieveEscapeIds(userId)
        }).to.throw(TypeError, '1 is not a string')
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})