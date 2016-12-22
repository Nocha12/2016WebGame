const socket = require('socket.io');

let io = socket.listen(4361);

io.sockets.on('connection', (socket) => {
    io.socket.emit('connection', '커넥트');
});