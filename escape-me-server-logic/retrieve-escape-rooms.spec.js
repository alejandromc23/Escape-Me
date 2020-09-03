require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const retrieveEscapeRooms = require('./retrieve-escape-rooms')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongoose, models: { User } } = require('escape-me-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve escape rooms', () => {
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
            const user_ = await User.create({ name, surname, username, email, password: hash })
            userId = user_.id
        }
        )

        it('should succeed on correct user id', async () => {
            const escapeRooms = await retrieveEscapeRooms(userId, 'favorites')

            expect(escapeRooms).to.exist
            expect(escapeRooms).to.be.an.instanceof(Array)
            expect(escapeRooms).to.have.lengthOf(0)

            const _user = await retrieveEscapeRooms(userId, 'pending')

            expect(escapeRooms).to.exist
            expect(escapeRooms).to.be.an.instanceof(Array)
            expect(escapeRooms).to.have.lengthOf(0)

            const __user = await retrieveEscapeRooms(userId, 'participated')

            expect(escapeRooms).to.exist
            expect(escapeRooms).to.be.an.instanceof(Array)
            expect(escapeRooms).to.have.lengthOf(0)
        }
        )
    })

    it('should fail when user does not exist', async () => {
        const userId = '5ed1204ee99ccf6fae798aef'

        try {
            const escapeRooms = await retrieveEscapeRooms(userId, 'pending')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`user with id ${userId} does not exist`)

        }
    })

    it('should fail if id is not a string', async () => {
        const user_ = await User.create({ name, surname, username, email, password: hash })
        userId = user_.id

        expect(() => {
            retrieveEscapeRooms(1, 'pending')
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            retrieveEscapeRooms(userId, 1)
        }).to.throw(TypeError, '1 is not a string')
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})