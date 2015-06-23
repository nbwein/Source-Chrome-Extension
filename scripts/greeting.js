'use strict';

/*var googlePlusUserLoader = (function() {

  var STATE_START=1;
  var STATE_ACQUIRING_AUTHTOKEN=2;
  var STATE_AUTHTOKEN_ACQUIRED=3;

  var state = STATE_START;

  var signin_button, xhr_button, revoke_button, user_info_div;

 function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
  }

  function enableButton(button) {
    button.removeAttribute('disabled');
  }

  function changeState(newState) {
    state = newState;
    switch (state) {
      case STATE_START:
        enableButton(signin_button);
        disableButton(xhr_button);
        disableButton(revoke_button);
        break;
      case STATE_ACQUIRING_AUTHTOKEN:
        sampleSupport.log('Acquiring token...');
        disableButton(signin_button);
        disableButton(xhr_button);
        disableButton(revoke_button);
        break;
      case STATE_AUTHTOKEN_ACQUIRED:
        disableButton(signin_button);
        enableButton(xhr_button);
        enableButton(revoke_button);
        break;
    }
  }*/

var access_global;

var googlePlusUserLoader  = (function() {
function xhrWithAuth(method, url, interactive, callback, params) {
    var access_token;

    var retry = true;

    getToken();

    function getToken() {
      chrome.identity.getAuthToken({ interactive: true}, function(token) {
       if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          console.log(chrome.runtime.lastError);
          return;
        }

        access_token = token;
	access_global = token;
        requestStart();
      });
    }

    function requestStart() {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      xhr.onload = requestComplete;
      if (params == ''){
	xhr.send();
	}
      else {xhr.send(params);}
    }

    function requestComplete() {
      if (this.status == 401 && retry) {
        retry = false;
        chrome.identity.removeCachedAuthToken({ token: access_token },
                                              getToken);
      } else {
        callback(null, this.status, this.response);
      }
    }
  }

  function getUserInfo(interactive) {
    xhrWithAuth('GET',
                'https://www.googleapis.com/plus/v1/people/me',
                interactive,
                onUserInfoFetched,
    		'');
    /*xhrWithAuth('GET', 
	        'https://www.googleapis.com/gmail/v1/users/me/drafts',
		interactive,
		onGmailInfoFetched); */
  }

  function onUserInfoFetched(error, status, response) {
    if (!error && status == 200) {
      //changeState(STATE_AUTHTOKEN_ACQUIRED);
      //sampleSupport.log(response);
      var user_info = JSON.parse(response);
      populateUserInfo(user_info);
    } else {
      console.log(response);
      console.log("error on user info fetch");
	//changeState(STATE_START);
    }
  }

  function populateUserInfo(user_info) {
    main_greeting.innerHTML = "Welcome, " + user_info.name.givenName;
  }

 /*function onGmailInfoFetched(error, status, response) {
	if (!error && status == 200) {
         
	//var user_info = JSON.parse(response);
    } else {
      console.log(response);
      console.log("error on drafts  info fetch");
        //changeState(STATE_START);
    }

}*/

function encodeURL(str){
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function sendEmail(){
        var message = $("#message-text").val();
	var subject = Math.trunc(Math.random()*1000).toString();
	console.log(subject);
	var params = encodeURL(btoa("From: me\r\nTo:" + "test-feed@googlegroups.com" + "\r\nSubject:"+ subject + "\r\n\r\n" + message));
	var numBytes = (params.length).toString();
	$.ajax({
		type: "POST",
		url: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
     		contentType: "application/json",
      		dataType: "json",
		beforeSend: function(xhr, settings) {
        		xhr.setRequestHeader('Authorization','Bearer ' + access_global);
      		},
		data: JSON.stringify({"raw": params})
	});
	$("#message-text").val('');
	//loadFeed();
	
	/*var http = new XMLHttpRequest();
	http.open("POST", 'https://www.googleapis.com/gmail/v1/users/me/messages/send');
	http.setRequestHeader('Authorization', 'Bearer ' + access_global);
	http.setRequestHeader('Content-Type', 'application/json');
	//http.setRequestHeader('Content-Length', numBytes);
	http.send(params);
        /*xhrWithAuth('POST',
                'https://www.googleapis.com/gmail/v1/users/me/messages/send/',
                true,
                function(error, status, response){
			console.log(response);
        /*var request = gapi.client.gmail.users.drafts.create({
                'userId': "me",
                'message': {
                        'raw': btoa("From: me\r\nTo:" + "test-feed@googlegroups.com" + "\r\nSubject:"+ "new\r\n" + message)
                }
        });
        request.execute(function(data){
                console.log(data)
        }); */
       /* }, 
	encodeURIComponent("raw="+btoa("From: me\r\nTo:" + "test-feed@googlegroups.com" + "\r\nSubject:"+ "subject" + "\r\n\r\n" + "message"))); */ 

}

function getCalendar() {
  $.ajax({ 
    type: "GET",
    url: encodeURI("https://www.googleapis.com/calendar/v3/users/me/calendarList/events?key=AIzaSyA8HYbU7zeqt58whlZiHpgI37b14pdFb9o"),
    dataType: 'json',
    beforeSend: function(xhr, settings) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_global);
    },
    success: function(response) {
      console.log(response);
    },
    error: function(response) {
      console.log(response);
    }
  });
}

return{
	onload: function() {
		getUserInfo(false);
		showTime();
		google.load("feeds", 1, {callback: loadFeed});
		gapi.client.load('gmail', 'v1');
    gapi.client.load('calendar', 'v3', getCalendar);
		//gapi.client.setApiKey('AIzaSyA8HYbU7zeqt58whlZiHpgI37b14pdFb9o');
		$("#submit").on("click", sendEmail);
	//	{callback: gapi.client.load('gmail', 'v1') };
	}
};
})();

//function ShowTime(){
        //var dt = new Date();
     	//cument.getElementById("main_greeting").innerHTML = "hello";
	//var date = new Date();
	//date = date.toLocaleString();
	//var elements = date.split(",");
	//var time = elements[0];
	//var date = elements[1];
        //document.write('<h2 id="date-time" align="center">', time , '<\/h2>');
	//document.write('<h2 id="date-time" align="center">', date , '<\/h2>');
 // }




window.onload = googlePlusUserLoader.onload;

var clientId = '847225712349-afs3e8aobcglbi1ml1gjkcr764ri1jvk.apps.googleusercontent.com';
var apiKey = 'AIzaSyA8HYbU7zeqt58whlZiHpgI37b14pdFb9o';
var scopes = 'https://www.googleapis.com/auth/plus.me';
