'use strict';

var access_global;
var user_info_global;
var email_global;
var user_pic;

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
			user_pic = user_info.image.url;
			email_global = user_info_global.emails[0].value;
			populateUserInfo(user_info);
		} else {
			console.log(response);
			console.log("error on user info fetch");
		}
	}

	function populateUserInfo(user_info) {
		getHCSession();
	}


	/* load all calendar content */
	function getCalendarSession(){
		gapi.auth.authorize(
			{client_id: '61085756406-hb2hcm5nj0sgmpj553r9uqao57cud33j.apps.googleusercontent.com', scope: ['https://www.googleapis.com/auth/calendar'], immediate: true},
			calendarContent);
		return false;
	}

	function calendarContent(){
		fetchLunches();
		nextMeeting();
		getSpecialEvents();
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

	/* Populates time-until-meeting header*/
	function nextMeeting() {
		var request = getCalendar();
		request.execute(function(resp) {
			var events = resp.items;
			if (events.length > 0) {
				var event = events[0];
				for (var i=0; i < events.length; i++){
					var startDate = new Date(events[i].start.dateTime);
					var diff = startDate.getTime() - (new Date()).getTime();
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
				setTimeout(nextMeeting, 60000);	     	
			}
			else {
				document.getElementById("next-meeting").innerHTML='';
				setTimeout(nextMeeting, 60000);
			}
		});

	}


	/* Dumps data from submission areas into corresponding google sheet. Uses google Apps script*/
	function makeSubmission(id, type){
		var text = $(id).val();
        	$(id).val('');
        	$.ajax({
                	method: 'POST',
              	 	url: 'https://script.google.com/macros/s/AKfycbwTv7T36GiGZWvNnEjyHVqW__eTbLqDL-eCCJXbR_VDUSYqOh4/exec',
                	data: {
                        	"type": type,
                        	"Name" : user_info_global.displayName,
                        	"Text" : text
               		 },
                	success: function(resp){
               		 },
                	error: function(resp){
                        	console.log("ERROR: " + resp);
               		 }
       		 });

	}
return {
	onload: function() {
		/* Load external info */
		setBackground();
		gapi.client.load('calendar', 'v3', getCalendarSession);
		getUserInfo(false);
		showTime();
		getJobs();
		loadValues();	 
		/* Set up click events */
		$("#submit-shoutout").on("click", function(){
			makeSubmission("#shoutout-text", "StellaShoutout");
		});
		$("#schedule").on("click", scheduleLunch);
		$("#submit-founders").on("click", function(){
			makeSubmission("#founders-q-text", "AskJJ");
		});
		$("#time").timepicker({
			'minTime':"11:00am",
			'maxTime':"10:00pm",
			'scrollDefault':'now',
			'step':15
		});
		$("#submit-gong").on("click", function(){
			makeSubmission("#gong-text", "GongShow");
		});
		$("#submit-message").on("click", postMessage);
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
			jQuery(this).attr("class", "join");
			jQuery(this).html("Join");
			var group = jQuery(this).parents();
			var id = group.attr('id');
			removeMember(id, user_info_global.displayName);
		});

		$(document).on("click", ".members", function() {
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
