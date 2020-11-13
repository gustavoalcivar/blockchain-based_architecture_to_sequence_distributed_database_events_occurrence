const socketIO = require('socket.io')

let io;

function listen (server) {
    io = socketIO(server);
    io.on('connection', function(socket) {
        console.log('a user connected');
    })
}

function notifyOn (data) {
    if (!io) {
        setTimeout(notify.bind(this, data), 1000)
    } else {
        notify(data)
    }
}

function notify (data) {
    io.emit('txns', data)
}

module.exports = {
    listen,
    notifyOn
}