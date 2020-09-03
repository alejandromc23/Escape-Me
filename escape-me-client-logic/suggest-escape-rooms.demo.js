global.XMLHttpRequest = require('xhr2')

const suggestEscapeRooms = require('./suggest-escape-rooms');

(async () => {
    const escapeRooms = await suggestEscapeRooms('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWVhNDA3OGVjMTFlMTZlMTY5ZmU3ZjUiLCJpYXQiOjE1OTI0MTAyMzcsImV4cCI6MTU5MjQ5NjYzN30.3HRAw2K31CzhlcbZ2iQ-GYEnGAb2OCqQmDvjAVkgg9E')

    console.log(escapeRooms)
})()