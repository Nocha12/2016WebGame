const socket = io.connect('http//localhost:4361');

socket.on('connection', (data) => {
    alert(data);
});