const socketIo = require('socket.io');

let io;

const seedVersion = Math.random().toString().replace('0.', '');

const init = (server) => {

    io = socketIo(server);

    io.on('connection', client => {

        emit('system.version', { seedVersion });

        client.on('event', data => { /* … */ });
        client.on('disconnect', () => { /* … */ });

    });

    return io;

};

const emit = (event, payload) => {
    if (io) {
        io.emit(event, payload);
    }
}

exports.init = init;
exports.emit = emit;
