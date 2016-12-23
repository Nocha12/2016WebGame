window.addEventListener('load', onLoad);

function onLoad() {
    let socket = io.connect('http://localhost:9999');

    let input = document.getElementById('input');
    let sendButton = document.getElementById('send');
    let chatContainer = document.getElementById('chat');
    let handshaked = false;

    input.addEventListener('keydown', sendMessage);
    sendButton.addEventListener('click', sendMessage);

    function sendMessage(event) {
        if(!handshaked) return;

        if((event.type === 'keydown' && event.which === 13) || event.type === 'click') {
            event.preventDefault();
            socket.emit('chat', {message: input.value});
            input.value = '';
        }
    }

    socket.on('welcome', data => {
        handshaked = true;
        chatContainer.innerHTML += `${data.nickname}님 환영합니다.\n`;
    });

    socket.on('chat', data => {
        addMessage(data, false);
    });

    socket.on('whisper', data => {
        addMessage(data, true);
    });

    socket.on('change nickname', data => {
        chatContainer.innerHTML += `${data.old}님이 ${data.new}로 닉네임을 변경하셨습니다.\n`;
    });

    socket.on('user disconnected', data => {
        chatContainer.innerHTML += `${data.nickname}님이 접속을 종료하였습니다.\n`;
    });

    function addMessage(data, isWhisper) {
        if(isWhisper) {
            chatContainer.innerHTML += `${data.nickname}님으로 부터온 귓속말 : ${data.message}\n`;
        } else {
            chatContainer.innerHTML += `${data.nickname} : ${data.message}\n`;
        }    

        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}