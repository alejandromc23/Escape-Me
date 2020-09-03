require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL, TEST_SECRET: SECRET } } = process

const commentEscapeRoom = require('./comment-escape-room')
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

describe('logic - comment escape room', () => {
    before(() => {
        return mongoose.connect(MONGODB_URL)
            .then(async () => {
                await EscapeRoom.deleteMany()

            })
    })

    let name, surname, username, email, password, escapeRoom, hash, escapeId, token

    beforeEach(async () => {
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

            escapeRoom = await EscapeRoom.create(
                {
                    "name": "catacumbas",
                    "description": "Las leyendas sobre la Alquimia han sido durante siglos uno de los mayores misterios de la historia. Los alquimistas decían poder conseguir la transformación de los metales en oro, aunque su objetivo se centraba en un reto mayor, la obtención de la piedra alquímica. A dicho objeto se le atribuyen propiedades mágicas, entre ellas la inmortalidad. Gracias a las interpretaciones de los últimos escritos de los que se tiene conocimiento, se cree que dicha piedra podría encontrarse en las catacumbas de Minos, en la isla de Creta.Vida eterna y riqueza infinita, objetivos por los que durante décadas muchos aventureros intentaron ir en su búsqueda. Por desgracia, sin éxito alguno……. salir con vida de las catacumbas no es tan fácil.Aunque como ya hemos dicho, todo esto son solamente mitos y leyendas, ¿verdad?",
                    "priceMin": 100,
                    "priceMax": 154,
                    "playersMin": 4,
                    "playersMax": 8,
                    "genre": "aventuras",
                    "difficulty": 2,
                    "url": "http://goldenpop.es/catacumbas/",
                    "city": "berga",
                    "image": "https://societytoescape.org/wp-content/uploads/2020/02/Sin-t%C3%ADtulo-2asdf.png",
                    "reviews": [
                        {
                            "user": mongoose.ObjectId(userId),
                            "rating": 4,
                        }
                    ],
                    "__v": 0,
                    "rating": 4
                }
            )
            escapeId = escapeRoom._id.toString()

            await commentEscapeRoom(escapeId, 'yes')

            const escape = await EscapeRoom.findOne({ _id: mongoose.ObjectId(escapeId) })

            const { reviews } = escape

            let date = new Date().toISOString()

            let [formatedDate,] = date.split('T')

            expect(reviews).to.exist
            expect(reviews).to.be.an.instanceOf(Array)
            expect(reviews).to.have.lengthOf(1)
            expect(reviews[0].comment.message).to.equal('yes')
            expect(reviews[0].comment.date).to.equal(formatedDate)

        })
    })

    describe('if userId or escapeId are wrong', () => {
        it('should fail when user does not exist', async () => {
            const _userId = '5ee1fa2be1ef46672229f028'
            token = await jwtPromised.sign({ sub: _userId }, SECRET)
            await context.storage.setItem('token', token)
            const _escapeId = '5ee1fa2be1ef46672229f028'

            try {
                await commentEscapeRoom(_escapeId, 'eyee')
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
                await commentEscapeRoom(_escapeId, 'eyee')
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
        token = await jwtPromised.sign({ sub: userId }, SECRET)
        await context.storage.setItem('token', token)

        expect(() => {
            commentEscapeRoom(1, 'eyee')
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            commentEscapeRoom('5ee1fa2be1ef46672229f028', 1)
        }).to.throw(TypeError, '1 is not a string')

    })

    afterEach(() => User.deleteMany().then(() => EscapeRoom.deleteMany()))

    after(mongoose.disconnect)
})