const call = require('./call')
require('../polyfills/xhr')

call('GET', 'https://skylabcoders.herokuapp.com/api/hotwheels/vehicles?q=black')
    .then(response => {
        const { status, body } = response

        if (status !== 200) throw new Error(`unexpected status ${status}`)

        const vehicles = JSON.parse(body)

        const first10 = vehicles.slice(0, 10)

        const details = first10.map(vehicle =>
            call('GET', `https://skylabcoders.herokuapp.com/api/hotwheels/vehicles/${vehicle.id}`)
                .then(({ status, body }) => {
                    if (status !== 200) throw new Error(`unexpected status ${status}`)

                    return JSON.parse(body)
                })
        )

        return Promise.all(details)
    })
    .then(vehicles => vehicles.forEach(console.log))
    .catch(console.error)