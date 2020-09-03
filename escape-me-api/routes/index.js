const { env: { SECRET } } = process

const { Router } = require('express')
const { registerUser, authenticateUser, retrieveUser, toggleEscapeRoomPending, toggleEscapeRoomParticipated, toggleEscapeRoomFavorites, toggleFollowUser, retrieveEscapeRoomsFavorites, retrieveEscapeRoomsParticipated, retrieveEscapeRoomsPending, retrieveFollowing, searchUsers, searchEscapeRoom, retrieveFollowingIds, retrieveEscapeIds, suggestEscapeRooms, retrieveEscapeRoomDetails, rateEscapeRoom, commentEscapeRoom } = require('./handlers')
const bodyParser = require('body-parser')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')

const parseBody = bodyParser.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()

api.post('/users', parseBody, registerUser)

api.post('/users/auth', parseBody, authenticateUser)

api.post('/escape/search/:query?', parseBody, searchEscapeRoom)

api.post('/escape/rate/', parseBody, verifyExtractJwt, rateEscapeRoom)

api.post('/escape/comment/', parseBody, verifyExtractJwt, commentEscapeRoom)

api.get('/users/:userId?', verifyExtractJwt, retrieveUser)

api.get('/suggest/', suggestEscapeRooms)

api.get('/escape/details/:escapeId', parseBody, retrieveEscapeRoomDetails)

api.get('/ids/following/:userId?', verifyExtractJwt, retrieveFollowingIds)

api.get('/ids/escapes/:userId?', verifyExtractJwt, retrieveEscapeIds)

api.get('/users/escape/favorites/:userId?', verifyExtractJwt, retrieveEscapeRoomsFavorites)

api.get('/users/escape/participated/:userId?', verifyExtractJwt, retrieveEscapeRoomsParticipated)

api.get('/users/escape/pending/:userId?', verifyExtractJwt, retrieveEscapeRoomsPending)

api.get('/users/search/:query?', verifyExtractJwt, searchUsers)

api.get('/following/:userId?', verifyExtractJwt, retrieveFollowing)

api.patch('/users/pending', parseBody, verifyExtractJwt, toggleEscapeRoomPending)

api.patch('/users/participated', parseBody, verifyExtractJwt, toggleEscapeRoomParticipated)

api.patch('/users/favorites', parseBody, verifyExtractJwt, toggleEscapeRoomFavorites)

api.patch('/users/follow', parseBody, verifyExtractJwt, toggleFollowUser)


module.exports = {
    api
}