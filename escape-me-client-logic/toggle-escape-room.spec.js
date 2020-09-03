require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_SECRET: SECRET, TEST_API_URL: API_URL } } = process

const toggleEscapeRoom = require('./toggle-escape-room')
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

describe('logic - toggle escape room', () => {
    let users, escapeRooms

    let name, surname, username, email, password, token, hash, userId, escapeId

    before(() => {
        return mongo.connect(MONGODB_URL)
            .then(connection => {
                users = connection.db().collection('users')
                escapeRooms = connection.db().collection('escaperooms')

                return escapeRooms.insertOne({
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
            .then(_escapeRoom => escapeId = _escapeRoom.insertedId.toString())
    })

    beforeEach(() => {
        return users.deleteMany()
            .then(() => {
                name = `name-${random()}`
                surname = `surname-${random()}`
                username = `${name}${surname}`
                email = `e-${random()}@mail.com`
                password = `password-${random()}`
                participated = []
                following = []
                pending = []
                favorites = []
                return bcrypt.hash(password, 10)
            })
            .then(_hash => hash = _hash)

    })

    describe('when userId escapeId and tag are correct', () => {

        it('should succeed on adding the escape room to the correct tag ', () => {
            return users.insertOne({ name, surname, username, email, password: hash, participated, pending, favorites })
                .then(_user => {
                    userId = _user.insertedId.toString()
                    return jwtPromised.sign({ sub: _user.insertedId.toString() }, SECRET)
                })
                .then(_token => context.storage.setItem('token', _token))
                .then(() => {
                    return toggleEscapeRoom(escapeId, 'pending')
                })
                .then(() => {
                    return users.findOne({ _id: mongo.ObjectId(userId) })
                })
                .then(__user => {
                    const { pending } = __user

                    expect(pending).to.exist
                    expect(pending).to.be.an.instanceof(Array)
                    expect(pending).to.have.lengthOf(1)
                    expect(pending[0].toString()).to.equal(escapeId)

                    return toggleEscapeRoom(escapeId, 'participated')
                })
                .then(() => {
                    return users.findOne({ _id: mongo.ObjectId(userId) })
                })
                .then(__user => {
                    const { participated } = __user

                    expect(participated).to.exist
                    expect(participated).to.be.an.instanceof(Array)
                    expect(participated).to.have.lengthOf(1)
                    expect(participated[0].toString()).to.equal(escapeId)

                    return toggleEscapeRoom(escapeId, 'favorites')
                })
                .then(() => {
                    return users.findOne({ _id: mongo.ObjectId(userId) })
                })
                .then(__user => {
                    const { favorites } = __user

                    expect(favorites).to.exist
                    expect(favorites).to.be.an.instanceof(Array)
                    expect(favorites).to.have.lengthOf(1)
                    expect(favorites[0].toString()).to.equal(escapeId)

                })

        })

        it('should succeed on deleting the escape room to the correct tag ', () => {
            return users.insertOne({ name, surname, username, email, password: hash, participated: [escapeId], pending: [escapeId], favorites: [escapeId] })
                .then(_user => {
                    userId = _user.insertedId.toString()
                    return jwtPromised.sign({ sub: _user.insertedId.toString() }, SECRET)
                })
                .then(_token => context.storage.setItem('token', _token))
                .then(() => {
                    return toggleEscapeRoom(escapeId, 'pending')
                })
                .then(() => {
                    return users.findOne({ _id: mongo.ObjectId(userId) })
                })
                .then(__user => {
                    const { pending } = __user

                    expect(pending).to.exist
                    expect(pending).to.be.an.instanceof(Array)
                    expect(pending).to.have.lengthOf(0)

                    return toggleEscapeRoom(escapeId, 'participated')
                })
                .then(() => {
                    return users.findOne({ _id: mongo.ObjectId(userId) })
                })
                .then(__user => {
                    const { participated } = __user

                    expect(participated).to.exist
                    expect(participated).to.be.an.instanceof(Array)
                    expect(participated).to.have.lengthOf(0)

                    return toggleEscapeRoom(escapeId, 'favorites')
                })
                .then(() => {
                    return users.findOne({ _id: mongo.ObjectId(userId) })
                })
                .then(__user => {
                    const { favorites } = __user

                    expect(favorites).to.exist
                    expect(favorites).to.be.an.instanceof(Array)
                    expect(favorites).to.have.lengthOf(0)

                })

        })
    })

    describe('if userId or escapeId are wrong', () => {

        it('should fail when escape room does not exist', async () => {
            const _user = await users.insertOne({ name, surname, username, email, password: hash })

            userId = _user.insertedId.toString()

            token = await jwtPromised.sign({ sub: userId }, SECRET)
            await context.storage.setItem('token', token)

            const _escapeId = '5ee1fa2be1ef46672229f028'

            try {
                const user = await toggleEscapeRoom(_escapeId, 'pending')
                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(UnexistenceError)
                expect(error.message).to.equal(`escape room with id ${_escapeId} does not exist`)

            }
        })
    })

    it('should fail when data inputs are wrong', async () => {
        const _user = await users.insertOne({ name, surname, username, email, password: hash })

        userId = _user.insertedId.toString()

        token = await jwtPromised.sign({ sub: userId }, SECRET)
        await context.storage.setItem('token', token)

        expect(() => {
            toggleEscapeRoom(1, 'pending')
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            toggleEscapeRoom(escapeId, 1)
        }).to.throw(TypeError, '1 is not a string')

    })

    afterEach(() => users.deleteMany())

    after(() => escapeRooms.deleteMany().then(mongo.disconnect))
})