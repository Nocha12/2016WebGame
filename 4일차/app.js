let socket = io.connect('http://localhost:9999');
 
socket.on('connection', (socket) =>{
    console.log("app");
});