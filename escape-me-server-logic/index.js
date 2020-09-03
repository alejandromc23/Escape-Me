module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    toggleEscapeRoom: require('./toggle-escape-room'),
    toggleFollowUser: require('./toggle-follow-user'),
    retrieveEscapeRooms: require('./retrieve-escape-rooms'),
    retrieveFollowing: require('./retrieve-following'),
    searchEscapeRoom: require('./search-escape-room'),
    searchUsers: require('./search-users'),
    retrieveEscapeIds: require('./retrieve-escape-ids'),
    retrieveFollowingIds: require('./retrieve-following-ids'),
    suggestEscapeRooms: require('./suggest-escape-rooms'),
    retrieveEscapeRoomDetails: require('./retrieve-escape-room-details'),
    rateEscapeRoom: require('./rate-escape-room'),
    commentEscapeRoom: require('./comment-escape-room')
}