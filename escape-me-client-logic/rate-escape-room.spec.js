require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL, TEST_SECRET: SECRET } } = process

const rateEscapeRoom = require('./rate-escape-room')
const { random } = Math
const { expect } = require('chai')

const { mongoose, models: { User, EscapeRoom } } = require('escape-me-data')
const { errors: { UnexistenceError } } = require('escape-me-commons')
const { utils: { jwtPromised } } = require('escape-me-node-commons')
const bcrypt = require('bcryptjs')
const context = require('./context')
context.API_URL = API_URL
const AsyncStorage = require('not-async-storage')
context.storage = AsyncStorage

describe('logic - rate escape room', () => {
    before(() => {
        return mongoose.connect(MONGODB_URL)
    })

    let name, surname, username, email, password, escapeRoom, hash, escapeId, token

    beforeEach(async () => {
        await EscapeRoom.deleteMany()
        await User.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `${name}${surname}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, 10)

    })

    describe('when userId escapeId and number are correct', () => {

        it('should succeed on adding the escape room to the correct tag ', async () => {
            const _user = await User.create({ name, surname, username, email, password: hash })
            userId = _user.id
            token = await jwtPromised.sign({ sub: userId }, SECRET)
            await context.storage.setItem('token', token)
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
            escapeId = escapeRoom._id.toString()

            await rateEscapeRoom(escapeId, 5)

            const escape = await EscapeRoom.findOne({ _id: mongoose.ObjectId(escapeId) })
            debugger
            const { reviews, rating } = escape

            expect(reviews).to.exist
            expect(reviews).to.be.an.instanceOf(Array)
            expect(reviews).to.have.lengthOf(1)
            expect(reviews[0].user.toString()).to.equal(userId)
            expect(rating).to.equal(5)

        })

        it('should succeed on updating the escape room rating ', async () => {
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
            escapeId = escapeRoom._id.toString()

            let _user = await User.create({ name, surname, username, email, password: hash })
            userId = _user.id
            token = await jwtPromised.sign({ sub: userId }, SECRET)
            await context.storage.setItem('token', token)

            await rateEscapeRoom(escapeId, 5)

            let escape = await EscapeRoom.findOne({ _id: mongoose.ObjectId(escapeId) })

            let { reviews, rating } = escape

            expect(reviews).to.exist
            expect(reviews).to.be.an.instanceOf(Array)
            expect(reviews).to.have.lengthOf(1)
            expect(reviews[0].user.toString()).to.equal(userId)
            expect(rating).to.equal(5)

            await rateEscapeRoom(escapeId, 4)

            escape = await EscapeRoom.findOne({ _id: mongoose.ObjectId(escapeId) })

            expect(escape.reviews).to.exist
            expect(escape.reviews).to.be.an.instanceOf(Array)
            expect(escape.reviews).to.have.lengthOf(1)
            expect(escape.reviews[0].user.toString()).to.equal(userId)
            expect(escape.rating).to.equal(4)

        })
    })

    describe('if userId or escapeId are wrong', () => {
        it('should fail when user does not exist', async () => {
            const _userId = '5ee1fa2be1ef46672229f028'
            token = await jwtPromised.sign({ sub: _userId }, SECRET)
            await context.storage.setItem('token', token)
            const _escapeId = '5ee1fa2be1ef46672229f028'

            try {
                await rateEscapeRoom(_escapeId, 4)
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
            token = await jwtPromised.sign({ sub: userId }, SECRET)
            await context.storage.setItem('token', token)

            const _escapeId = '5ee1fa2be1ef46672229f028'
            try {
                await rateEscapeRoom(_escapeId, 4)
                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(UnexistenceError)
                expect(error.message).to.equal(`escape room with id ${_escapeId} does not exist`)

            }
        })
    })

    it('should fail when data inputs are wrong', async () => {
        const _user = await User.create({ name, surname, username, email, password: hash })
        userId = _user.id

        expect(() => {
            rateEscapeRoom(1, 5)
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            rateEscapeRoom('5ee1fa2be1ef46672229f028', 'a')
        }).to.throw(TypeError, 'a is not a number')

    })

    afterEach(() => User.deleteMany().then(() => EscapeRoom.deleteMany({})))

    after(mongoose.disconnect)
})