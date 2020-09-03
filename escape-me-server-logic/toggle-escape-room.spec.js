require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const toggleEscapeRoom = require('./toggle-escape-room')
const { random } = Math
const { expect } = require('chai')

const { mongoose, models: { User, EscapeRoom } } = require('escape-me-data')
const { errors: { UnexistenceError } } = require('escape-me-commons')
const bcrypt = require('bcryptjs')

describe('logic - toggle escape room', () => {
    before(() => {
        return mongoose.connect(MONGODB_URL)
            .then(async () => {
                await EscapeRoom.deleteMany()

                escapeRoom = await EscapeRoom.create({
                    name: 'whitechappel',
                    description: 'En 1888, en un famoso barrio londinense llamado Whitechapel, ocurrieron una serie de asesinatos cometidos por Jack el Destripador. Ahora, 130 años después, un asesino le está haciendo tributo y causando el caos siguiendo los pasos del mismísimo Jack. En nuestro Room escape os retaremos a descifrar una serie de enigmas que desafiarán vuestra inteligencia, imaginación y cooperación además de poner a prueba vuestros miedos. Ingenio, colaboración, perspectiva... Todos los sentidos deben estar alerta, cualquier pequeño detalle puede ser primordial para superar el desafío.',
                    priceMin: 50,
                    priceMax: 90,
                    playersMin: 2,
                    playersMax: 6,
                    genre: 'terror',
                    difficulty: 3,
                    url: 'http://www.roomwhitechapel.com/',
                    province: 'barcelona',
                    city: 'barcelona',
                    image: 'https://storage.googleapis.com/absolute-enigmatiumroom/images/v01/whitechapel.jpg'
                })
            })
    })

    let name, surname, username, email, password, escapeRoom, hash, userId, escapeId

    beforeEach(async () => {
        await User.deleteMany()

        escapeId = escapeRoom.id

        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `${name}${surname}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, 10)

    })

    describe('when userId escapeId and tag are correct', () => {

        it('should succeed on adding the escape room to the correct tag ', async () => {
            const _user = await User.create({ name, surname, username, email, password: hash })
            userId = _user.id

            await toggleEscapeRoom(userId, escapeId, 'pending')

            let __user = await User.findOne(mongoose.ObjectId(userId))

            const { pending } = __user

            expect(pending).to.exist
            expect(pending).to.be.an.instanceof(Array)
            expect(pending).to.have.lengthOf(1)
            expect(pending[0].toString()).to.equal(escapeId)

            await toggleEscapeRoom(userId, escapeId, 'participated')

            __user = await User.findOne(mongoose.ObjectId(userId))

            const { participated } = __user

            expect(participated).to.exist
            expect(participated).to.be.an.instanceof(Array)
            expect(participated).to.have.lengthOf(1)
            expect(participated[0].toString()).to.equal(escapeId)

            await toggleEscapeRoom(userId, escapeId, 'favorites')

            __user = await User.findOne(mongoose.ObjectId(userId))

            const { favorites } = __user

            expect(favorites).to.exist
            expect(favorites).to.be.an.instanceof(Array)
            expect(favorites).to.have.lengthOf(1)
            expect(favorites[0].toString()).to.equal(escapeId)

        })

        it('should succeed on deleting the escape room to the correct tag ', async () => {
            const _user = await User.create({ name, surname, username, email, password: hash, pending: [mongoose.ObjectId(escapeId)], participated: [mongoose.ObjectId(escapeId)], favorites: [mongoose.ObjectId(escapeId)] })
            userId = _user.id

            await toggleEscapeRoom(userId, escapeId, 'pending')

            let __user = await User.findOne(mongoose.ObjectId(userId))

            const { pending } = __user

            expect(pending).to.exist
            expect(pending).to.be.an.instanceof(Array)
            expect(pending).to.have.lengthOf(0)

            await toggleEscapeRoom(userId, escapeId, 'participated')

            __user = await User.findOne(mongoose.ObjectId(userId))

            const { participated } = __user

            expect(participated).to.exist
            expect(participated).to.be.an.instanceof(Array)
            expect(participated).to.have.lengthOf(0)

            await toggleEscapeRoom(userId, escapeId, 'favorites')

            __user = await User.findOne(mongoose.ObjectId(userId))

            const { favorites } = __user

            expect(favorites).to.exist
            expect(favorites).to.be.an.instanceof(Array)
            expect(favorites).to.have.lengthOf(0)

        })
    })

    describe('if userId or escapeId are wrong', () => {
        it('should fail when user does not exist', async () => {
            const _userId = '5ee1fa2be1ef46672229f028'
            try {
                const user = await toggleEscapeRoom(_userId, escapeId, 'pending')
                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(UnexistenceError)
                expect(error.message).to.equal(`user with id ${_userId} does not exist`)

            }
        })
        it('should fail when escape room does not exist', async () => {
            const _user = await User.create({ name, surname, username, email, password: hash })
            userId = _user.id
            const _escapeId = '5ee1fa2be1ef46672229f028'
            try {
                const user = await toggleEscapeRoom(userId, _escapeId, 'pending')
                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(UnexistenceError)
                expect(error.message).to.equal(`escape room with id ${_escapeId} does not exist`)

            }
        })
    })

    it('should fail when data inputs are wrong', async () => {
        expect(() => {
            toggleEscapeRoom(1, escapeId, 'pending')
        }).to.throw(TypeError, '1 is not a string')

        const _user = await User.create({ name, surname, username, email, password: hash })
        userId = _user.id

        expect(() => {
            toggleEscapeRoom(userId, 1, 'pending')
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            toggleEscapeRoom(userId, escapeId, 1)
        }).to.throw(TypeError, '1 is not a string')

        const tag = 'a random string'
        expect(() => {
            toggleEscapeRoom(userId, escapeId, tag)
        }).to.throw(UnexistenceError, `tag ${tag} does not exist`)
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})