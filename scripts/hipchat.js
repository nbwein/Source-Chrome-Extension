/* Hipchat Message Board JS*/

var personal_token;
var oauthID = "fe8cc8d0-00da-4f24-a663-62bbaeb32507";
var client_secret = 'Iqlm09LwavRgRHO2TPebSUdKI6gEXQHRUangE0YU';
var group_id = '50006';
var room_id = '1721606';
var room_stats;


/* Load 10 most recent messages into the message board */
function getHipChat(){
	$.ajax({
		method: 'GET', 
		url: 'https://api.hipchat.com/v2/room/intern-project-message-board/history?auth_token=' + personal_token + "&max-results=10",
		grant_type: 'personal',
		success: function(resp){
			console.log(resp);
			var messages = resp.items;
			var container = document.getElementById("message-board");
                        var headerDiv = document.createElement("div");
                        headerDiv.setAttribute("id", "message-header");
                        headerDiv.setAttribute("text-align", "center");
                        var headerText = document.createElement("h3");
                        headerText.setAttribute("id", "message-header-text");
                        headerText.innerHTML = "Message Board";
                        headerDiv.appendChild(headerText);
                        var textArea = document.createElement("textArea");
                        var postMessageDiv = document.createElement("div");
						postMessageDiv.setAttribute("id", "post-message");
                        textArea.setAttribute("id", "message-text");
                        textArea.setAttribute("type", "text");
                        textArea.setAttribute("name", "message");
                        textArea.setAttribute("placeholder", "New message...");
                        var submitBtn = document.createElement("a");
                        submitBtn.setAttribute("href", "#");
                        submitBtn.setAttribute("id", "submit-message");
                        submitBtn.setAttribute("class", "btn btn-lg");
                        submitBtn.innerHTML = "Post";
                        postMessageDiv.appendChild(textArea);
                        postMessageDiv.appendChild(submitBtn);
			container.appendChild(headerDiv);
                        container.appendChild(postMessageDiv);
			$("#submit-message").on("click", postMessage);
			for (var i = messages.length - 1; i >= 0; i--){
				var message = messages[i];
				var author = message.from.name;
				var div = document.createElement("div");
				if (author != "R2 D2" && typeof(author) != 'undefined'){
				var pic = document.createElement("img");
				getUserPic(message.from.id, pic);
				var datetime = message.date.split("T");
				var date = datetime[0];
				var time = datetime[1].split(":");
				var ampm = "am";
				time[0] = time[0] - 4;
				if (time[0] >= 12){
					var ampm = "pm";
					if (time[0] > 12){
						time[0] = time[0] - 12;
					}
				}
				date = date.split("-");
				if (date[1][0] == '0'){
					date[1] = date[1][1];
				}
				if (date[2][0] == '0'){
					date[2] = date[2][1];
				}
				date = date[1] + "/" + date[2];
				time = time[0] + ":" + time[1];
				var entry = message.message;
				var auth = document.createElement("strong");
				pic.setAttribute("class", "profile-pic");
                                auth.setAttribute("id", "message-author");
                                auth.innerHTML = author;
                                div.appendChild(auth);
                                var br = document.createElement("br");
                              	div.appendChild(br);
                                t = document.createElement("span");
                                t.className = "message-time";
                                t.innerHTML = time + " " + ampm + ", " + date;
                                div.appendChild(t);
                                var message = document.createElement("p");
                                message.setAttribute("id", "message");
                                message.innerHTML = entry;
                                div.appendChild(pic);
                                div.className = "post";
                                div.appendChild(message);
                                div.setAttribute("align","center");
                                container.appendChild(div);
				}
			}
		},
		error: function(resp){
			console.log(resp);
			refreshToken();
		}
	});

}

/* Fetch user pictures  
NEED TO ADD SCOPE TO OAUTH ID FOR THIS TO WORK    view_group ONLY  */
function getUserPic(id, pic){
/*	$.ajax({
		type: 'GET', 
		url: 'https://api.hipchat.com/v2/user/' + id + '?auth_token=' + personal_token + "&auth_test=true",
		success: function(resp){
			pic.setAttribute("src", resp.photo_url);
		},
		error: function(error){
			console.log(error);
		}
	}); */

}

/* Send a message to the Hipchat message board and reload the feed */
function postMessage(){
	var post = $("#message-text").val();
        $.ajax({
                type: 'POST',
                url: 'https://api.hipchat.com/v2/room/intern-project-message-board/message?auth_token=' + personal_token,
		contentType:"application/json; charset=utf-8",
		dataType: "json",
		data: '{"message":"' + post + '"}',
                error: function(resp){
                        console.log(resp);
                }
        })
	.done(function(resp){
		$("#message-text").val('');
                $("#message-board").empty();
                getHipChat();
	});

}

/* Checks to see if personal token has already been aquired, if not initiates OAuth flow to aquire one*/
function getHCSession(){
 	if (typeof localStorage["hc_token"] == 'undefined'){
		document.getElementById('dialog').style.display="";
		$("#hc_login").on('click', function(){
		var username = $("#hc_username").val();
		var password = $("#hc_password").val();
		$("#hc_username").val('');
		$("#hc_password").val('');
		document.getElementById('dialog').style.display="none";
		hcOAuth(username, password);
		});
		console.log("personal token set");	
	}
	else{
		personal_token = localStorage["hc_token"];
		getHipChat();
		console.log("got from storage")
	}

}	

function refreshToken(){
	$.ajax({
                method: 'POST',
		url: 'https://api.hipchat.com/v2/oauth/token',
		contentType: 'application/x-www-form-urlencoed',
		beforeSend: function(xhr){
                                xhr.setRequestHeader("Authorization", "Basic " + btoa( oauthID + ":" + client_secret));
                },
		data: {
			'grant_type':'refresh_token',
			'refresh_token': localStorage["hc_refresh_token"]
		},
		success: function(resp){
			localStorage["hc_token"] = resp.access_token;
		}
	});
		

		
}

/* Hipchat OAuth flow */
function hcOAuth(username, password){
		$.ajax({
			type: 'POST', 
			url: 'https://api.hipchat.com/v2/oauth/token',
			contentType: 'application/x-www-form-urlencoded',
			beforeSend: function(xhr){
				xhr.setRequestHeader("Authorization", "Basic " + btoa( oauthID + ":" + client_secret)); 
			},
			data: {
				'grant_type':'password',
				'username':username,
				'password': password,
				'scope':[ 'send_message', 'view_messages', 'view_group']
			},
			error: function(resp){
				console.log(resp);
			},
			success: function(resp){
				console.log(resp);
				localStorage["hc_token"] = resp.access_token;
				localStorage["hc_refresh_token"] = resp.refresh_token;
				personal_token = localStorage["hc_token"];
				getHipChat();
				}
			}); 
} 

/* Polls hipchat every 3 seconds, reloading the message board feed if the total number of messages has increased
ALSO NEED TO ADD A SCOPE FOR THIS TO WORK  view_room or view_group*/
function pollHipChat(){
	$.ajax({
		type: 'GET', 
		url: 'https://api.hipchat.com/v2/room/intern-project-message-board/statistics?auth_token=' + personal_token,
		success: function(resp){
			curr_messages = resp.messages_sent;
			if (typeof room_stats == 'undefined'){
				room_stats = resp.messages_sent;
			}
			else if (curr_messages > room_stats){
				room_stats = curr_messages
				$("#message-board").empty();
                		getHipChat();
			}
			console.log("poll");
			setTimeout(pollHipChat, 3000);
			
		},
		error: setTimeout(pollHipChat, 3000)
	});
};
