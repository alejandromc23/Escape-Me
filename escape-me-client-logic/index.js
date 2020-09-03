const context = require('./context')


module.exports = {
    get __context__() { return context },

    context: require('./context'),
    registerUser: require('./register-user'),
    loginUser: require('./login-user'),
    isUserLoggedIn: require('./is-user-loggedIn'),
    retrieveUser: require('./retrieve-user'),
    toggleEscapeRoom: require('./toggle-escape-room'),
    toggleFollowUser: require('./toggle-follow-user'),
    retrieveEscapeRooms: require('./retrieve-escape-rooms'),
    retrieveFollowing: require('./retrieve-following'),
    searchEscapeRoom: require('./search-escape-room'),
    searchUsers: require('./search-users'),
    retrieveFollowingIds: require('./retrieve-following-ids'),
    retrieveEscapeIds: require('./retrieve-escape-ids'),
    suggestEscapeRooms: require('./suggest-escape-rooms'),
    retrieveEscapeRoomDetails: require('./retrieve-escape-room-details'),
    rateEscapeRoom: require('./rate-escape-room'),
    commentEscapeRoom: require('./comment-escape-room'),
}