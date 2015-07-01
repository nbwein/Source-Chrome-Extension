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
			calendarContent);
		return false;
	}

	function calendarContent(){
		fetchLunches();
		nextMeeting();
	}

	function getCalendar() {	
		var midnight = new Date((new Date().getTime() + 24*60*60*1000));
		midnight.setHours(0,0,0,0);
		var request = gapi.client.calendar.events.list({
			'calendarId': 'primary',
			'timeMin': (new Date()).toISOString(),
			'showDeleted': false,
			'singleEvents': true,
			'maxResults': 5, 
			'timeMax' : midnight.toISOString(),
			'orderBy': 'startTime'
		});
		return request;
	}

	/*function getLunchCalendar() {
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

	} */

	function nextMeeting() {
		var request = getCalendar();
		request.execute(function(resp) {
			var events = resp.items;
			if (events.length > 0) {
				var event = events[0];
				for (var i=0; i < events.length; i++){
					var startDate = new Date(events[i].start.dateTime);
					if ((diff > 0)){
						var event = events[i];
						break;
					}
				}
				var startDate = new Date(event.start.dateTime);
				var diff = startDate.getTime() - (new Date()).getTime();
				if (!(diff < 0)){
				var x = Math.trunc(diff / (60*1000));
				var minutes = x % 60;
				x = Math.trunc(x/60);
				var hours = x % 24;
				var hours_until = minutes + " minutes until " + event.summary;
				if (hours != 0){
					hours_until = hours + " hours, " + hours_until  
				}
				document.getElementById("next-meeting").innerHTML = hours_until;
				}
				setTimeout(getCalendar, 1000);	     	
			}
			else {
				/***SHOULD THERE BE AN ELSE?***/
			}
		});

	}

/*	function fetchLunches(){
		var request = getLunchCalendar(); 
		request.execute(function(resp){
			var events = resp.items;

			if (events.length > 0) {
				var container = document.getElementById("lunch");
				for (var i = 0; i < events.length; i++) {
					var id = events[i].id;
					var time = events[i].start.dateTime;
					var times = ((time.split("T")[1]).split("-")[0]).split(":");
					var ampm = "am";
					if (times[0] > 12) {
						times[0] = times[0] - 12;
						ampm = "pm"
					}
					else if (times[0] == 12){
						ampm = "pm"
					}
					time = times[0] + ":" + times[1];
					var entry = events[i].location + " " + time + " " + ampm + " ";
					var div = document.createElement("div");
					div.appendChild(document.createTextNode(entry));

					var join = document.createElement("a");
					join.setAttribute("id", "join");
					join.setAttribute("href", "#");

					var members = document.createElement("a");
					members.setAttribute("id", "members");
					members.setAttribute("href", "#");

					var joinText = document.createTextNode("Join");

					// if (events[i].creator.email == email_global) {
					// 	join.className = "join-clicked";
					// 	joinText = document.createTextNode("Joined!");
					// }
					join.className = "btn join";

					for (var person in events[i].attendees) {
						console.log(events[i].attendees[person]);
						if (events[i].attendees[person].email == email_global) {
							join.className = "join-clicked";
							joinText = document.createTextNode("Joined!");
						}
					}

					members.className = "btn members";
					var memText = document.createTextNode("Members");

					join.appendChild(joinText);
					members.appendChild(memText);
					div.appendChild(join);
					div.appendChild(members);
					div.className = "post";
					div.setAttribute("id", id);
					container.appendChild(div);
				}

			}
		});

	//nextMeeting();
} */


function appendPre(message) {
	var pre = document.getElementById('upcoming-events');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}


function testGet(){
	$.ajax({
		method : 'GET',
		url : 'https://groups.google.com/forum/#!forum/test-feed',
		datatype : 'html',
		success : function(resp){  console.log(resp); }
	});
	

}

/*CHANGE THIS TO NATE'S EMAIL ADDRESS BEFORE RELEASE */
function submitGong(){
	var message = $("#gong-text").val();
	var subject = "Gong Show Submission";
	var params = encodeURL(btoa("From: me\r\nTo:" + "madeline.cripps@stellaservice.com" + "\r\nSubject:"+ subject + "\r\n\r\n" + message));
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
	$("#gong-text").val('');


}
return {
	onload: function() {
		gapi.client.load('gmail', 'v1');
		gapi.client.load('calendar', 'v3', getCalendarSession);
		getUserInfo(false);
		showTime();
		loadFeed();
		getJobs();
		loadValues()
		//testGet();
		
		$("#submit-message").on("click", sendEmail);
		$("#submit-shoutout").on("click", sendShoutout);
		$("#submit-lunch").on("click", scheduleLunch);
		$("#time").timepicker({
			'minTime':"11:00am",
			'maxTime':"10:00pm",
			'scrollDefault':'now',
			'step':15
		});
		$("#submit-gong").on("click", submitGong)
		$(document).on("click", ".join", function() {
			jQuery(this).attr("id", "join-clicked");
			jQuery(this).attr("class", "join-clicked");
			jQuery(this).html("Joined!");
			var group = $("#join-clicked").parents();
			jQuery(this).attr("id", "join");
			var id = group.attr('id');
			addEvent(id);
		});

		$(document).on("click", ".join-clicked", function() {
			jQuery(this).attr("class", "btn join");
			jQuery(this).html("Join");
			var group = jQuery(this).parents();
			var id = group.attr('id');
			removeMember(id, user_info_global.displayName);
		});

		$(document).on("click", ".members", function() {
			jQuery(this).attr("id", "members");
			var group = $("#members").parents();
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
