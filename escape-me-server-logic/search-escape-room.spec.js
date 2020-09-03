require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const searchEscapeRoom = require('./search-escape-room')
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongoose, models: { EscapeRoom } } = require('escape-me-data')
const { errors: { ValueError } } = require('escape-me-commons')


describe('logic - search escape room', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let result

    beforeEach(async () => {
        await EscapeRoom.deleteMany()
        await EscapeRoom.create({
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
            image: 'https://storage.googleapis.com/absolute-enigmatiumroom/images/v01/whitechapel.jpg',
            rating: 4.8
        })

        await EscapeRoom.create({
            name: 'abduction 1',
            description: 'Después de meses de planificación, habéis logrado introduciros en la Cancillería del Reich Alemán. Al cruzar la puerta, os convertiréis en espías al servicio de las fuerzas aliadas de la Segunda Guerra Mundial. Vuestra misión es descubrir el lugar donde se encuentra Adolf Hitler y transmitir su posición a vuestros aliados para poner fin a la guerra. ¿Seréis capaces de cambiar la historia?',
            priceMin: 50,
            priceMax: 84,
            playersMin: 2,
            playersMax: 6,
            genre: 'terror',
            difficulty: 2,
            url: 'https://www.abduction.es/badalona/abduction1.html',
            province: 'barcelona',
            city: 'badalona',
            image: 'https://www.blogbadalona.com/images/ocio/room-escape-abduction-badalona.jpg',
            rating: 4.9
        })
        await EscapeRoom.create({
            name: 'la juguetería maldita',
            description: 'La juguetería maldita de Arcadi Balaguer es un lugar tenebroso y oscuro, una fuente de leyendas urbanas en el corazón de Barcelona. Como reputados asesores paranormales y médiums, ya os interesaba el caso antes de que la familia os pidiera ayuda para resolver las desapariciones que se han producido a lo largo de los años. La línea que separa el mundo de los vivos y los muertos es muy delgada. ¿Os atrevéis a entrar en una dimensión desconocida para resolver el misterio del maestro artesano? Tened cuidado y estad atentos...en la juguetería maldita no se juega.',
            priceMin: 50,
            priceMax: 96,
            playersMin: 2,
            playersMax: 6,
            genre: 'terror',
            difficulty: 3,
            url: 'https://thewitchinghour.es/la-jugueteria-maldita/',
            province: 'barcelona',
            city: 'barcelona',
            image: 'https://escapeowosbcn.files.wordpress.com/2018/11/11.jpg',
            rating: 4.8
        })
        await EscapeRoom.create({
            name: 'vikingos',
            description: 'Cada nueve años el pueblo vikingo peregrinaba hacia el templo sagrado de Upssala. A través de diferentes rituales y sacrificios veneraban y honraban a los dioses. Estos, en agradecimiento les brindaban su protección y fuerza para las batallas. En una de esas ceremonias ocurrió una invasión inesperada que interrumpió el ritual provocando la ira de los dioses que condenaron a la humanidad con el temido día del Ragnarok, el fin del mundo. La profecía que auguraron los dioses se acerca y solo auténticos vikingos pueden detenerla y salvarnos de las fuerzas del mal y del caos. La única manera de cambiar nuestro destino es volviendo al templo de Upssala y completar el sacrificio. ¡Recordad que solo la sangre calmará la ira de los dioses! ¿Seréis los elegidos? ¡Juega Vikingos de Unreal Gavà Room Escape!',
            priceMin: 66,
            priceMax: 112,
            playersMin: 2,
            playersMax: 7,
            genre: 'aventuras',
            difficulty: 2,
            url: 'https://unrealroomescape.es/gava/#reservas',
            province: 'barcelona',
            city: 'gavà',
            image: 'https://unrealroomescape.es/gava/wp-content/uploads/2014/06/joc-vikingos.jpg',
            rating: 4.9
        })
    }
    )

    describe('when values introduced are correct', () => {
        it('should succeed on retrieving data', async () => {
            result = await searchEscapeRoom(undefined, { genre: ['terror', 'aventuras'], difficulty: [2, 3], moreThanPlayersMax: 6, moreThanPriceMax: 95 })
            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(2)

            result = await searchEscapeRoom('vik', { moreThanPlayersMax: 7 })
            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(1)

            result = await searchEscapeRoom('vik', { moreThanPriceMax: 70, lessThanPriceMax: 140 })
            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(1)

            result = await searchEscapeRoom('vik', { moreThanPriceMax: 70, lessThanPriceMax: 140 })
            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(1)

            result = await searchEscapeRoom(undefined, { moreThanPriceMax: 70, lessThanPriceMax: 140, moreThanPlayersMax: 5, lessThanPlayersMin: 3 })
            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(4)

            result = await searchEscapeRoom(undefined, { moreThanRating: 3, lessThanRating: 5, moreThanPlayersMax: 5, lessThanPlayersMin: 6 })
            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(4)
        }
        )
        it('should retrieve an empty array if the match does not exist', async () => {
            result = await searchEscapeRoom(undefined, { genre: ['terror', 'aventuras'], difficulty: [2, 3], moreThanPlayersMax: 6, moreThanPriceMax: 95, lessThanPriceMin: 20 })
            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(0)

            result = await searchEscapeRoom(undefined, { moreThanPlayersMax: 9 })
            expect(result).to.exist
            expect(result).to.be.an.instanceOf(Array)
            expect(result).to.have.lengthOf(0)
        })
    })

    it('should fail if inputs introduced are wrong ', () => {
        expect(() => {
            searchEscapeRoom(1, {})
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            searchEscapeRoom(undefined, { genre: [1] })
        }).to.throw(TypeError, '1 is not a string')

        expect(() => {
            searchEscapeRoom(undefined, { moreThanPlayersMax: true })
        }).to.throw(TypeError, 'true is not a number')

        expect(() => {
            searchEscapeRoom(undefined, { lessThanPlayersMax: -5 })
        }).to.throw(ValueError, '-5 is not a positive number')

        expect(() => {
            searchEscapeRoom(undefined, { moreThanPlayersMin: true })
        }).to.throw(TypeError, 'true is not a number')
    })

    afterEach(() => EscapeRoom.deleteMany())

    after(mongoose.disconnect)
})