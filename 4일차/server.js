let io = require('socket.io')(9999);
let chatingLogs = {};
let nickNames = {};

io.on('connection', (client) => {
    //console.log(`${client.id}`);   
    let userName = 'user' + '[' + client.id.slice(0, 3) + ']';
    nickNames[client.id] = userName;
    chatingLogs[client.id] = '';
    client.on('disconnect', () => {
       // console.log(`해제 : ${client.id}`);
    });

    client.on('send message', (data) => {
        if(data.message.split(' ')[0] == '/nickName')
        {
            userName = data.message.split(' ')[1];
            nickNames[client.id] = userName;
            console.log(nickNames[client.id]);
        }
        else
        {
            chatingLogs.forEach(function(element) {
                element += userName + '\n' + data.message + '\n\n';
                console.log("ok");
            }, this);
        }
    });

    setInterval(() => {
        io.emit('check alive', {message: chatingLogs[client.id]})
    }, 100);
});
