function sendEmail(){
	var message = $("#message-text").val();
	xhrWithAuth('GET',
                'https://www.googleapis.com/gmail/v1/users/me/drafts',
                interactive,
                function(){
	var request = gapi.client.gmail.users.drafts.create({
		'userId': "me",
		'message': {
			'raw': btoa("From: me\r\nTo:" + "test-feed@googlegroups.com" + "\r\nSubject:"+ "new\r\n" + message)
		}	
	});
	request.execute(function(data){
		console.log(data)
	});
	});

}

