let io = require('socket.io')(9999);

io.on('connection', (socket) => {
    console.log(`${socket.id}`);
});