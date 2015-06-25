'use strict';

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
}

function onUserInfoFetched(error, status, response) {
  if (!error && status == 200) {
      console.log("here");
      var user_info = JSON.parse(response);
      populateUserInfo(user_info);
    } else {
      console.log(response);
      console.log("error on user info fetch");
    }
  }

  function populateUserInfo(user_info) {
    main_greeting.innerHTML = "Welcome, " + user_info.name.givenName;
    console.log(user_info.name.givenName);
    console.log("HERE");
  }

  function populateUserInfo(user_info) {
    main_greeting.innerHTML = "Welcome, " + user_info.name.givenName + ".";
  }

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
    $("#message-board").empty();
    loadFeed();
  }

  function sendShoutout(){
    var message = $("#shoutout-text").val();
    var subject = Math.trunc(Math.random()*1000).toString();
    var params = encodeURL(btoa("From: me\r\nTo:" + "shoutout-feed@googlegroups.com" + "\r\nSubject:"+ subject + "\r\n\r\n" + message));
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
    $("#shoutout-text").val('');
  }


function getCalendarSession(){
	gapi.auth.authorize(
    {client_id: '847225712349-afs3e8aobcglbi1ml1gjkcr764ri1jvk.apps.googleusercontent.com', scope: ['https://www.googleapis.com/auth/calendar.readonly'], immediate: true},
    getCalendar);
  return false;
}


function getCalendar() {
	var midnight = new Date((new Date().getTime() + 24*60*60*1000));
	midnight.setHours(0,0,0,0);
	var request = gapi.client.calendar.events.list({
   'calendarId': 'primary',
   'timeMin': (new Date()).toISOString(),
   'showDeleted': false,
   'singleEvents': true,
   'maxResults': 1, 
   'timeMax' : midnight.toISOString(),
   'orderBy': 'startTime'
 });

	request.execute(function(resp){
		var events = resp.items;
		
    if (events.length > 0) {
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }

        var startDate = new Date(event.start.dateTime);
        var diff = startDate.getTime() - (new Date()).getTime();
        var x = Math.trunc(diff / (60*1000));
        var minutes = x % 60;
        x = Math.trunc(x/60);
        var hours = x % 24;
        var hours_until = minutes + " minutes until " + event.summary;
        if (hours != 0){
          hours_until = hours + " hours, " + hours_until  
        }
        document.getElementById("next-meeting").innerHTML = hours_until;
        setTimeout(getCalendar, 1000);	     	
      }
    } else {
           // appendPre('No upcoming events found.');
         }
       });
}


function appendPre(message) {
  var pre = document.getElementById('upcoming-events');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}


function tryPrivate(){

chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
        var headers = info.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1); // Remove header
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
);

document.getElementById("forum_embed").src =
  "https://groups.google.com/forum/embed/?place=forum/test-feed-private" +
  "&showsearch=true&showpopout=true&parenturl=" +
  encodeURIComponent(window.location.href) + "&output=embed";

}

return {
	onload: function() {
		getUserInfo(false);
		showTime();
		loadFeed();
		gapi.client.load('gmail', 'v1');
   		gapi.client.load('calendar', 'v3', getCalendarSession);
    		$("#submit-message").on("click", sendEmail);
    		$("#submit-shoutout").on("click", sendShoutout);
		fetchLunches();
		$("#submit-lunch").on("click", scheduleLunch);
		$(".join").on("click", addEvent);

  }
};
})();


window.onload = googlePlusUserLoader.onload;

var clientId = '847225712349-afs3e8aobcglbi1ml1gjkcr764ri1jvk.apps.googleusercontent.com';
var apiKey = 'AIzaSyA8HYbU7zeqt58whlZiHpgI37b14pdFb9o';
var scopes = 'https://www.googleapis.com/auth/plus.me';
