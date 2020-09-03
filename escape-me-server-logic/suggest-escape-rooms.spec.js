require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const suggestEscapeRooms = require('./suggest-escape-rooms')
const { random } = Math
const { expect } = require('chai')
require('escape-me-commons/polyfills/json')
const { mongoose, models: { User, EscapeRoom } } = require('escape-me-data')
const bcrypt = require('bcryptjs')

describe('logic - suggest escape rooms', () => {
    let escapes = []
    let escape
    before(() => {
        return mongoose.connect(MONGODB_URL)
            .then(async () => {
                await EscapeRoom.deleteMany()

                escape = await EscapeRoom.create({
                    name: 'whitechappel',
                    description: 'En 1888, en un famoso barrio londinense llamado Whitechapel, ocurrieron una serie de asesinatos cometidos por Jack el Destripador. Ahora, 130 años después, un asesino le está haciendo tributo y causando el caos siguiendo los pasos del mismísimo Jack. En nuestro Room escape os retaremos a descifrar una serie de enigmas que desafiarán vuestra inteligencia, imaginación y cooperación además de poner a prueba vuestros miedos. Ingenio, colaboración, perspectiva... Todos los sentidos deben estar alerta, cualquier pequeño detalle puede ser primordial para superar el desafío.',
                    priceMin: 50,
                    priceMax: 90,
                    playersMin: 2,
                    playersMax: 6,
                    genre: 'terror',
                    difficulty: 3,
                    url: 'http://www.roomwhitechapel.com/',
                    city: 'barcelona',
                    image: 'https://storage.googleapis.com/absolute-enigmatiumroom/images/v01/whitechapel.jpg',
                    rating: 4.8
                })

                escapes.push(escape.id)

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
                    city: 'gavà',
                    image: 'https://unrealroomescape.es/gava/wp-content/uploads/2014/06/joc-vikingos.jpg',
                    rating: 4.9
                })
                await EscapeRoom.create({
                    name: 'el cóctel del doctor',
                    description: 'En su casa, el Doctor esta a punto de finalizar su trabajo. ¿Deseáis ver, en lo que está trabajando?¡Acepta su invitación y ven a conocerle! Después de recibir la invitación del Doctor,os encontraréis tomando uno de sus cócteles preferidos.¡Disfrutadlo!',
                    priceMin: 60,
                    priceMax: 108,
                    playersMin: 2,
                    playersMax: 6,
                    genre: 'terror',
                    difficulty: 3,
                    url: 'https://www.insomniacorp.com/el-coctel-del-doctor/',
                    city: 'berga',
                    image: 'https://www.insomniacorp.com/wp-content/uploads/coctel-del-doctor.jpg',
                    rating: 4.9
                })

                escape = await EscapeRoom.create({
                    name: 'misión s.w.a.t.',
                    description: 'John era un soldado SWAT que lideraba un equipo contra una célula terrorista. En una de las misiones se producen unas explosiones y todos logran salvarse menos John. Sus restos jamás fueron hallados y aunque algunos afirman que el cuerpo fue volatilizado en la explosión, otros creen que fue capturado por el enemigo. 10 años después, los SWAT son alertados de que el comando terrorista se ha rearmado y están preparando un nuevo ataque.¿Estáis preparados para reducir y eliminar de una vez por todas al comando terrorista que acabó con la vida de vuestro compañero John y honrar así su muerte? Y más aún… ¿seréis capaces de conseguirlo sin John en vuestras filas?',
                    priceMin: 66,
                    priceMax: 119,
                    playersMin: 2,
                    playersMax: 7,
                    genre: 'criminal',
                    difficulty: 2,
                    url: 'https://openmindroomescape.es/#juegos',
                    city: 'berga',
                    image: 'https://openmindroomescape.es/wp-content/uploads/2014/05/room-escape-mision-swat.jpg',
                    rating: 4.9
                })

                escapes.push(escape.id)

                await EscapeRoom.create({
                    name: 'doppler',
                    description: 'Luccio Leone se ha propuesto rodar el mejor Spaguetti Western de la historia y Klint Eastgood quiere ese papel a toda costa! Por eso te ha contratado… Junta al mejor equipo, entrad en el plató de grabación, conseguid una copia del guion y salid sin ser vistos.',
                    priceMin: 60,
                    priceMax: 240,
                    playersMin: 2,
                    playersMax: 16,
                    genre: 'misterio',
                    difficulty: 2,
                    url: 'https://www.dopplerexperiences.com/',
                    city: 'berga',
                    image: 'https://storage.googleapis.com/absolute-escaperoominfinity/images/v01/acto-1-vientos-de-polvora-escape-room-barcelona.jpg',
                    rating: 4.9
                })
                await EscapeRoom.create({
                    name: 'mafia',
                    description: 'Estáis trabajando para la mafia. Vuestra misión es recuperar las pruebas que incriminan a Felix Manchunga, el capo de la mafia barcelonesa: las fotos fueron tomadas por un detective privado. Haced lo que sea necesario para completar la misión pero no olvidéis para quién estáis trabajando...',
                    priceMin: 60,
                    priceMax: 108,
                    playersMin: 2,
                    playersMax: 6,
                    genre: 'criminal',
                    difficulty: 2,
                    url: 'https://www.chickenbanana.com/es',
                    city: 'berga',
                    image: 'https://www.fcbarcelona.com/fcbarcelona/photo/2018/06/26/b27237de-0483-4cb2-89f6-8431724f8160/67212502.jpg',
                    rating: 4.9
                })
                await EscapeRoom.create({
                    name: 'kidnapped in bcn',
                    description: 'Es un Juego de Escape que te sumergirá en una película al más puro estilo Hollywood. Prepárate para enfrentarte a los secuestradores, interactuar con ellos y usar tus habilidades.',
                    priceMin: 80,
                    priceMax: 120,
                    playersMin: 3,
                    playersMax: 5,
                    genre: 'criminal',
                    difficulty: 2,
                    url: 'https://kidnappedinbcn.com/',
                    city: 'berga',
                    image: 'https://media-cdn.tripadvisor.com/media/photo-s/11/2e/1e/45/ready-for-a-tarantino.jpg',
                    rating: 4.9
                })
                await EscapeRoom.create({
                    name: 'petit piaf hotel',
                    description: 'Petit Piaf Hotel es el único Room Escape donde puedes escapar dejando atrás a tus amigos. Salir solo o en grupo sólo depende de tí. Ven a vivir esta nueva experiencia y descubre el intríngulis de jugar contra tu mismo grupo. Nuestro hotel está repleto de historias, ven a escribir la tuya. Desconocemos el motivo de tu visita, quizás en tu equipaje encuentres información relevante. Una vez dentro del hotel tú decides: ¿esperar al resto o salir el primero?',
                    priceMin: 80,
                    priceMax: 90,
                    playersMin: 2,
                    playersMax: 5,
                    genre: 'criminal',
                    difficulty: 2,
                    url: 'http://www.intringulisbcn.com/reserves.php',
                    city: 'barcelona',
                    image: 'https://media-cdn.tripadvisor.com/media/photo-s/10/0e/6b/04/petit-piaf-hotel-el-primer.jpg',
                    rating: 4.9
                })
                await EscapeRoom.create({
                    name: 'the house of whispers',
                    description: 'Olivia, una actriz y guionista, empieza a tener sueños tormentosos haciéndose más oscura en su escritura de guiones y con foco en un personaje en particular llamado "Él. Uno de sus hijos fallece en extrañas circunstancias, y según ella el culpable es "Él", cosa que la hunde en la depresión. Después de un divorcio y de ser hospitalizada, el director Tourner le ofrece un trabajo para escribir una obra de terror para su siguiente película. Todo parece ir bien hasta noviembre del mismo año cuando recibe la última carta de parte de Olivia y pierde la comunicación por completo.',
                    priceMin: 55,
                    priceMax: 85,
                    playersMin: 2,
                    playersMax: 5,
                    genre: 'terror',
                    difficulty: 2,
                    url: 'http://thehouseofwhispers.com/',
                    city: 'barcelona',
                    image: 'data:image/png;base64,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',
                    rating: 4.9
                })
                escape = await EscapeRoom.create({
                    name: 'rebelión de las máquinas',
                    description: 'Año 2250. Desde hace años un puñado de sobrevivientes está llevando a cabo sin éxito una guerra clandestina con las máquinas que gobiernan el planeta. Por fin, la humanidad tiene una oportunidad real de liberarse, porque logró obtener los archivos y planos viejos de la corporación que hace años había diseñado estos monstruos mecánicos. Vosotros sois un grupo de choque enviado para desarchivar su refugio antiaéreo y llegar al reactor principal de máquinas. Disponéis sólo de 60 minutos para eliminar el corazón energético del Reactor y cambiar el curso de esta guerra. La Quest crea la atmósfera post-apocalíptica cuando la gente se ve obligada a luchar diariamente para sobrevivir en catacumbas. Pero la esperanza es la última que muere, a pesar de que la cantidad de las máquinas y armas supera la de la gente. Un puñado de Homo Sapiens es capaz de dar un giro de 180º y cambiar el curso de acontecimientos. ¿Pero tendréis tiempo para hacerlo? Las máquinas ya dieron con sus huellas y están acercando rápidamente…',
                    priceMin: 40,
                    priceMax: 95,
                    playersMin: 2,
                    playersMax: 6,
                    genre: 'ficcion',
                    difficulty: 2,
                    url: 'https://questeros.es/quests/rebelion',
                    city: 'berga',
                    image: 'https://clarovideocdn5.clarovideo.net/CRACKLE/PELICULAS/100002022/EXPORTACION_WEB/SS/100002022WHORIZONTAL.jpg?size=675x380',
                    rating: 4.9
                })
                escapes.push(escape.id)
                await EscapeRoom.create({
                    name: 'cronologic',
                    description: 'Escoge destino, abróchate el cinturón y déjate llevar por el nuevo modelo más sofisticado. Experimenta este capricho de la Ciencia, un adelanto del futuro a un módico precio para ti. Interactúa con el entorno más que nunca. Explora en lo desconocido y descubre la historia de esta aventura gráfica en vivo.',
                    priceMin: 60,
                    priceMax: 90,
                    playersMin: 2,
                    playersMax: 5,
                    genre: 'ficcion',
                    difficulty: 2,
                    url: 'https://www.cronologic.es/',
                    city: 'berga',
                    image: 'https://storage.googleapis.com/absolute-enigmatiumroom/images/v01/cronologic-barcelona.jpg',
                    rating: 4.9
                })
                await EscapeRoom.create({
                    name: 'génesis',
                    description: 'GENESIS corporation es una red neuronal global diseñada para imitar y suplantar las emociones humanas. Está por todas partes, no puedes verla pero sí sentirla. El mundo que ves ha sido puesto ante tus ojos para ocultar la verdadera realidad. Qué es real? Genesis corporation no os dirá como acabará todo, ha venido a deciros cómo va a comenzar...',
                    priceMin: 50,
                    priceMax: 91,
                    playersMin: 2,
                    playersMax: 7,
                    genre: 'ficcion',
                    difficulty: 2,
                    url: 'http://totemescaperoom.com/es/',
                    city: 'berga',
                    image: 'https://static.wixstatic.com/media/2f731d_ada28e50aee14ed5b846225e3b55a78d~mv2.jpg/v1/fill/w_1000,h_625,al_c,q_90,usm_0.66_1.00_0.01/2f731d_ada28e50aee14ed5b846225e3b55a78d~mv2.jpg',
                    rating: 4.9
                })
                await EscapeRoom.create({
                    name: 'catacumbas',
                    description: 'Las leyendas sobre la Alquimia han sido durante siglos uno de los mayores misterios de la historia. Los alquimistas decían poder conseguir la transformación de los metales en oro, aunque su objetivo se centraba en un reto mayor, la obtención de la piedra alquímica. A dicho objeto se le atribuyen propiedades mágicas, entre ellas la inmortalidad. Gracias a las interpretaciones de los últimos escritos de los que se tiene conocimiento, se cree que dicha piedra podría encontrarse en las catacumbas de Minos, en la isla de Creta.Vida eterna y riqueza infinita, objetivos por los que durante décadas muchos aventureros intentaron ir en su búsqueda. Por desgracia, sin éxito alguno……. salir con vida de las catacumbas no es tan fácil.Aunque como ya hemos dicho, todo esto son solamente mitos y leyendas, ¿verdad?',
                    priceMin: 100,
                    priceMax: 154,
                    playersMin: 4,
                    playersMax: 8,
                    genre: 'aventuras',
                    difficulty: 2,
                    url: 'http://goldenpop.es/catacumbas/',
                    city: 'berga',
                    image: 'https://societytoescape.org/wp-content/uploads/2020/02/Sin-t%C3%ADtulo-2asdf.png',
                    rating: 4.9
                })
            })
    })

    let name, surname, email, password, userId, username

    beforeEach(async () => {
        await User.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `${name}${surname}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`
        participated = escapes

        hash = await bcrypt.hash(password, 10)
    })

    describe('suggest when user already exists or  when no user id is introduced', () => {
        beforeEach(async () => {
            const user_ = await User.create({ name, surname, username, email, password: hash, participated })
            userId = user_.id
        }
        )

        it('should succeed on correct user id', async () => {
            const escapeRooms = await suggestEscapeRooms(userId)

            expect(escapeRooms).to.exist
            expect(escapeRooms).to.be.an.instanceof(Array)
            expect(escapeRooms).to.have.lengthOf(9)
        }
        )

        it('should succeed on suggesting escape rooms if no user id is introduced', async () => {
            const escapeRooms = await suggestEscapeRooms()

            expect(escapeRooms).to.exist
            expect(escapeRooms).to.be.an.instanceof(Array)
            expect(escapeRooms).to.have.lengthOf(10)
        })
    })

    it('should fail if user id is introduced but incorrect', async () => {
        const userId = '5ed1204ee99ccf6fae798aef'

        try {
            const user = await suggestEscapeRooms(userId)
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
            suggestEscapeRooms(userId)
        }).to.throw(TypeError, '1 is not a string')
    })

    afterEach(() => User.deleteMany({}))

    after(() => EscapeRoom.deleteMany({}).then(mongoose.disconnect))
})