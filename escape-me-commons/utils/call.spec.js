const { expect } = require('chai')
const call = require('./call')
require('../polyfills/xhr')

describe('call', () => {
    it('should suceed on correct parameters in Google', done => {
        call('GET', 'https://skylabcoders.herokuapp.com/proxy?url=https://www.google.com', undefined, undefined, (error, status, body) => {
            if (error) return done(new Error(error))

            //console.log(status, body)
            expect(status).to.equal(200)
            expect(body).to.exist

            done()
        })
    })

    it('should succeed on correct parameteres in User API', done => {
        const username = `pepito-${Math.random()}`

        call('POST', 'https://skylabcoders.herokuapp.com/api/v2/users', `{ "username": "${username}", "password": "grillo" }`, { 'Content-type': 'application/json' }, (error, status, body) => {
            if (error) return done(new Error(error))

            debugger

            //console.log(status, body)
            expect(status).to.equal(201)
            expect(body).to.equal('')

            call('POST', 'https://skylabcoders.herokuapp.com/api/v2/users/auth', `{ "username": "${username}", "password": "grillo" }`, { 'Content-type': 'application/json' }, (error, status, body) => {
                if (error) return done(new Error(error))

                //console.log(status, body)
                expect(status).to.equal(200)
                expect(body).to.exist

                const { token } = JSON.parse(body)
                expect(token).to.be.a('string')

                call('GET', 'https://skylabcoders.herokuapp.com/api/v2/users', undefined, { 'Authorization': `Bearer ${token}` }, (error, status, body) => {
                    if (error) return done(new Error(error))

                    //console.log(status, body)
                    expect(status).to.equal(200)
                    expect(body).to.exist

                    call('DELETE', 'https://skylabcoders.herokuapp.com/api/v2/users', '{ "password": "grillo" }', { 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }, (error, status, body) => {
                        if (error) return done(new Error(error))

                        //console.log(status, body)
                        expect(status).to.equal(204)
                        expect(body).to.equal('')

                        done()
                    })
                })
            })
        })
    })

    it('should fail on wrong url', done => {
        call('GET', 'https://www.google.com.xy', undefined, undefined, (error, status, body) => {
            expect(error).to.exist
            expect(error.message).to.equal('network error')

            done()
        })
    })
})