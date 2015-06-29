'use strict';

  var access_global;
  var user_info_global;
  var email_global;

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
      var user_info = JSON.parse(response);
      user_info_global = user_info;
      email_global = user_info_global.emails[0].value;
      populateUserInfo(user_info);
    } else {
      console.log(response);
      console.log("error on user info fetch");
    }
  }

  function populateUserInfo(user_info) {
    document.getElementById("main_greeting").innerHTML = "Welcome, " + user_info.name.givenName + ".";
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
    {client_id: '847225712349-afs3e8aobcglbi1ml1gjkcr764ri1jvk.apps.googleusercontent.com', scope: ['https://www.googleapis.com/auth/calendar'], immediate: true},
    fetchLunches);
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
	return request;
}

function getLunchCalendar() {
	var midnight = new Date((new Date().getTime() + 24*60*60*1000));
        midnight.setHours(0,0,0,0);
        var request = gapi.client.calendar.events.list({
                'calendarId': 'stellaservice.com_bpkdnnmn30ddtc0e9pe96ekt8s@group.calendar.google.com',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 5,
                'timeMax' : midnight.toISOString(),
                'orderBy': 'startTime'
 });
        return request;

}

function nextMeeting() {
	var request = getCalendar();
	request.execute(function(resp){
		var events = resp.items;
    if (events.length > 0) {
        var event = events[0];
        

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
     else {
         }
       });
	
}

function fetchLunches(){
	console.log("here");
	var request = getLunchCalendar(); 
	request.execute(function(resp){
		var events = resp.items;
		if (events.length > 0){
		var container = document.getElementById("lunch");
		for (var i = 0; i < events.length; i++){
			var id = events[i].id;
			console.log(id);
			var time = events[i].start.dateTime;
			var times = ((time.split("T")[1]).split("-")[0]).split(":");
			time = times[0] + ":" + times[1];
			var entry = events[i].location + " " + time + " ";
			var div = document.createElement("div");
                        div.appendChild(document.createTextNode(entry));
			var join = document.createElement("button");
			var stat = document.createElement("span");
                        var members = document.createElement("button");
			if (events[i].creator.email == email_global){
				join.className = "join-clicked";
				join.setAttribute("disabled", true);
				join.setAttribute("hidden", true);
				stat.innerHTML = "     joined!     ";
			} 
			else{
                      		join.className = "join";
				for (var j in events[i].attendees){
					console.log(events[i].attendees[j]);
					if (events[i].attendees[j].email == email_global){
						join.className = "join-clicked";
                                		join.setAttribute("disabled", true);
                                		join.setAttribute("hidden", true);
                                		stat.innerHTML = "     joined!     ";
					}
				}
			}
                        join.setAttribute("id", "join");
                        members.className = "members";
                        var joinText = document.createTextNode("Join");
                        var memText = document.createTextNode("Members");
                        join.appendChild(joinText);
                        members.appendChild(memText);
			div.appendChild(stat);
                        div.appendChild(join);
                        div.appendChild(members);
                        div.className = "post";
                        div.setAttribute("id", id);
                        container.appendChild(div);
		}

		}
	});
	nextMeeting();
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
		gapi.client.load('gmail', 'v1');
                gapi.client.load('calendar', 'v3', getCalendarSession);
		getUserInfo(false);
		showTime();
		loadFeed();
    		$("#submit-message").on("click", sendEmail);
    		$("#submit-shoutout").on("click", sendShoutout);
    		$("#submit-lunch").on("click", scheduleLunch);
		$(document).on("click", ".join", function(){
			jQuery(this).attr("id", "join-clicked");
			jQuery(this).attr("class", "join-clicked");
			jQuery(this).attr("disabled", true); 
			var group = $("#join-clicked").parents();
			jQuery(this).attr("id", "join");
			var id = group.attr('id');
			addEvent(id);
		});
	        $(document).on("click", ".members", function(){
			jQuery(this).attr("id", "members-clicked");
			var group = $("#members-clicked").parents();
			jQuery(this).attr("id", "members");
			var id = group.attr('id');
			viewMembers(id);
		});
  }
};
})();


window.onload = googlePlusUserLoader.onload;

var clientId = '847225712349-afs3e8aobcglbi1ml1gjkcr764ri1jvk.apps.googleusercontent.com';
var apiKey = 'AIzaSyA8HYbU7zeqt58whlZiHpgI37b14pdFb9o';
var scopes = 'https://www.googleapis.com/auth/plus.me';
