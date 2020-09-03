const mongodb = require('mongodb')

const { ObjectId, connect } = mongodb

let connection

module.exports = {
    connect(url) {
        return connection ?
            Promise.resolve(connection)
            :
            connect(url, { useUnifiedTopology: true })
                .then(_connection => connection = _connection)
    },

    disconnect() {
        return connection.close().then(() => connection = undefined)
    },

    ObjectId
}
