/* Hipchat Message Board JS*/

var personal_token;
var integration_token;
var oauthID = "3885f451-68b5-4a97-aada-1461f5ce7099";
var client_secret = 'cb3s0lg9FuIlB2plZ8ISbhNTRKbm2sBmWV9yewBs';
var group_id = '50006';
var room_id = '1721606';
var room_stats;


/* Load 10 most recent messages into the message board */
function getHipChat(){
	$.ajax({
		method: 'GET', 
		url: 'https://api.hipchat.com/v2/room/intern-project-message-board/history?auth_token=' + integration_token + "&max-results=10",
		grant_type: 'personal',
		success: function(resp){
			console.log(resp);
			var messages = resp.items;
			var container = document.getElementById("message-board");

			var postMessageDiv = document.createElement("div");
			postMessageDiv.setAttribute("id", "post-message");

			var textArea = document.createElement("textArea");
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

			container.appendChild(postMessageDiv);
			$("#submit-message").on("click", postMessage);
			for (var i = messages.length - 1; i >= 0; i--){
				var message = messages[i];
				var author = message.from.name;
				var div = document.createElement("div");
				div.className = "post post-message";
				if (author != "R2 D2" && typeof(author) != 'undefined'){
				//getUserPic(message.from.id, pic);
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
				auth.setAttribute("id", "message-author");
				auth.innerHTML = author;

				var br = document.createElement("br");
				div.appendChild(br);

				var pic = document.createElement("img");
				pic.setAttribute("class", "profile-pic");
				getUserPic(message.from.id, pic);
				div.appendChild(pic);

				div.appendChild(auth);
				
				t = document.createElement("span");
				t.className = "message-time";
				t.innerHTML = " &#183 " + time + " " + ampm + ", " + date;
				div.appendChild(t);
				var message = document.createElement("p");
				message.setAttribute("id", "message");
				message.innerHTML = entry;
				
				div.appendChild(message);
				if (messages[i].message_links != null){
					for (var j = 0; j < messages[i].message_links.length; j++){
						if (messages[i].message_links[j].type == "image"){
							var attatchment = document.createElement("img");
							attatchment.setAttribute("src", messages[i].message_links[j].url);
							attatchment.setAttribute("height", "150px");
							attatchment.setAttribute("width", "auto");
							attatchment.setAttribute("class", "inline-pic");
							div.appendChild(attatchment);
						}
						else{
							var attatchment = document.createElement("a");
							attatchment.setAttribute("href", messages[i].message_links[j].url); 
							div.appendChild(attatchment);
						}
					}
				}
				div.setAttribute("align","center");
				container.appendChild(div);
			}
			}
		},
		error: function(resp){
			console.log(resp);
			integrationOAuth();
		}
	});

}

/* Fetch user pictures  
NEED TO ADD SCOPE TO OAUTH ID FOR THIS TO WORK    view_group ONLY  */
function getUserPic(id, pic){
	$.ajax({
		type: 'GET', 
		url: 'https://api.hipchat.com/v2/user/' + id + '?auth_token=' + personal_token,
		success: function(resp){
			//console.log(resp);
			pic.setAttribute("src", resp.photo_url);
		},
		error: function(error){
			console.log(error);
		}
	}); 
	/*$.ajax({
		type: 'GET', 
		url: 'https://api.hipchat.com/v2/user/' + id + '/history/latest?auth_token=' + personal_token,
		success: function(resp){
			console.log(resp);
		}, 
		error: function(resp){
			console.log(resp);
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
                	    console.log(localStorage.getItem("hc_refresh_token"));
                        refreshToken(localStorage.getItem("hc_refresh_token"));
                }
        })
	.done(function(resp){
		$("#message-text").val('');
        $("#post-message").remove();
		$(".post-message").remove();
                getHipChat();
	});

}

/* Checks to see if personal token has already been aquired, if not initiates OAuth flow to aquire one*/
function getHCSession(){
 	if (typeof localStorage["hc_token"] == 'undefined'){
		document.getElementById('dialog').style.display="";
		$("#dialog").css("display", "block");
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
		integration_token = localStorage["integration_token"];
		getHipChat();
		console.log(localStorage.getItem("hc_refresh_token"));
		console.log("got from storage");
	}

}	

function refreshToken(token){
	$.ajax({
                method: 'POST',
		url: 'https://api.hipchat.com/v2/oauth/token',
		contentType: 'application/x-www-form-urlencoed',
		beforeSend: function(xhr){
                                xhr.setRequestHeader("Authorization", "Basic " + btoa( oauthID + ":" + client_secret));
                },
		data: {
			'grant_type':'refresh_token',
			'refresh_token': token
		},
		success: function(resp){
			localStorage["hc_token"] = resp.access_token;
		}
	});
		

		
}
/* NOTE: only a personal token is necessary, but having both helps avoid exceeding hipchat api rate-limits. */

/* Hipchat OAuth flow for a personal token */
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
				if (resp.responseText.indexOf("User authorization failed") != -1){
				alert("Invalid Hipchat Credentials, please try again");
				$("#dialog").css("display", "block");
				$("#dialog").css("visibility", "visible");
				}
			},
			success: function(resp){
				console.log(resp);
				localStorage["hc_token"] = resp.access_token;
				localStorage["hc_refresh_token"] = resp.refresh_token;
				personal_token = localStorage["hc_token"];
				integrationOAuth();
				}
			}); 
} 

/* Request an Integration Token */
function integrationOAuth(){
	$.ajax({
		type:'POST', 
		url: 'https://api.hipchat.com/v2/oauth/token', 
		contentType: 'application/x-www-form-urlencoded',
                beforeSend: function(xhr){
                      xhr.setRequestHeader("Authorization", "Basic " + btoa( oauthID + ":" + client_secret));
                },
                data: {
                        'grant_type':'client_credentials',
			'scope':['view_group', 'view_messages']
                },
		error: function(resp){
			console.log("INTEGRATION TOKEN ERROR: " + resp);
		},
		success: function(resp){
			console.log(resp);
			 localStorage["integration_token"] = resp.access_token;
                         integration_token = localStorage["integration_token"];
                         getHipChat();
		}

	});
}


/* Polls hipchat every 30 seconds, reloading the message board feed if the total number of messages has increased*/
function pollHipChat(){
	$.ajax({
		type: 'GET', 
		url: 'https://api.hipchat.com/v2/room/intern-project-message-board/statistics?auth_token=' + integration_token,
		success: function(resp){
			curr_messages = resp.messages_sent;
			if (typeof room_stats == 'undefined'){
				room_stats = resp.messages_sent;
			}
			else if (curr_messages > room_stats){
				room_stats = curr_messages
				$(".post-message").remove();
				$("#post-message").remove();
                		getHipChat();
			}
			console.log("poll");
			setTimeout(pollHipChat, 10000);			
		},
		error: function(resp){
			console.log(resp);
			if (resp.responseText.indexOf("Unauthorized") != -1){
				integrationOAuth();
			}
			setTimeout(pollHipChat, 10000);
		}
	});
};
