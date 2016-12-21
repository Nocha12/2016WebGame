const net = require('net');

let server = net.createServer((client) => {
    console.log('클라이언트가 연결되었습니다.');
});

server.listen(9899, 'localhost', () => {
    console.log('서버가 실행되었습니다.');
});