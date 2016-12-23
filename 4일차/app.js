let socket = io.connect('http://localhost:9999');

$('textarea#input_message').live('keypress', (e) => {
	if (e.which == 13) {
        e.preventDefault();
        if($('textarea#input_message').val() != '')
        {
		    let textVal = $('textarea#input_message').val();
            $('textarea#input_message').val('');

            socket.emit('send message', {message: textVal});
        }
	}
});

socket.on('check alive', (data) => {
    $('textarea#message').val(data.message).scrollTop(999999999);
});
