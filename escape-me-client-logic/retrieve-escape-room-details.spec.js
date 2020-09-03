require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const retrieveEscapeRoomDetails = require('./retrieve-escape-room-details')
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongoose, models: { EscapeRoom } } = require('escape-me-data')

describe('logic - retrieve escape room details', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let escape, escapeId, name, description, priceMin, priceMax, playersMin, playersMax, genre, difficulty, province, url, city, image, rating
    beforeEach(async () => {
        await EscapeRoom.deleteMany()
    }
    )

    describe('when escape room exists', () => {
        beforeEach(async () => {
            name = 'whitechappel'
            description = 'En 1888, en un famoso barrio londinense llamado Whitechapel, ocurrieron una serie de asesinatos cometidos por Jack el Destripador. Ahora, 130 años después, un asesino le está haciendo tributo y causando el caos siguiendo los pasos del mismísimo Jack. En nuestro Room escape os retaremos a descifrar una serie de enigmas que desafiarán vuestra inteligencia, imaginación y cooperación además de poner a prueba vuestros miedos. Ingenio, colaboración, perspectiva... Todos los sentidos deben estar alerta, cualquier pequeño detalle puede ser primordial para superar el desafío.'
            priceMin = 50
            priceMax = 90
            playersMin = 2
            playersMax = 6
            genre = 'terror'
            difficulty = 3
            url = 'http://www.roomwhitechapel.com/'
            province = 'barcelona'
            city = 'barcelona'
            image = 'https://storage.googleapis.com/absolute-enigmatiumroom/images/v01/whitechapel.jpg'
            rating = 4.8

            escape = await EscapeRoom.create({
                name, description, priceMin, priceMax, playersMin, playersMax, genre, difficulty, province, url, city, image, rating
            })
            escapeId = escape._id.toString()
        }
        )

        it('should succeed on correct escape id', async () => {
            const escapeRoom = await retrieveEscapeRoomDetails(escapeId)

            expect(escapeRoom.name).to.equal(name)
            expect(escapeRoom.description).to.equal(description)
            expect(escapeRoom.url).to.equal(url)
            expect(escapeRoom.priceMin).to.equal(priceMin)
            expect(escapeRoom.priceMax).to.equal(priceMax)
            expect(escapeRoom.playersMax).to.equal(playersMax)
            expect(escapeRoom.playersMin).to.equal(playersMin)
            expect(escapeRoom.genre).to.equal(genre)
            expect(escapeRoom.difficulty).to.equal(difficulty)
            expect(escapeRoom.rating).to.equal(rating)
            expect(escapeRoom.image).to.equal(image)

        }
        )
    })

    it('should fail when escape does not exist', async () => {
        const escapeId = '5ed1204ee99ccf6fae798aef'

        try {
            const escape = await retrieveEscapeRoomDetails(escapeId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`escape room with id ${escapeId} does not exist`)

        }
    })

    it('should fail if id is not a string', async () => {
        const escapeId = 1

        expect(() => {
            retrieveEscapeRoomDetails(escapeId)
        }).to.throw(TypeError, '1 is not a string')
    })

    afterEach(() => EscapeRoom.deleteMany())

    after(mongoose.disconnect)
})