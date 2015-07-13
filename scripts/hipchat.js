/* Hipchat Message Board JS*/

var personal_token = 'xKSoB2LHgSHQ2ZhZ18jBzskWVbcAn1fULRFLwpYC';
var notification_token = '1abc6f6a4437b580ca33574cd9c064';
var oauth_token = '';
var client_secret = '';
var room_stats;


/* Load recent messages into the message board */
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
			//var div = document.createElement("div");
                        var textArea = document.createElement("textArea");
                        var postMessageDiv = document.createElement("div");
                        textArea.setAttribute("id", "message-text");
                        textArea.setAttribute("maxlength", "296");
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
			for (var i = messages.length - 1; i >= 0; i--){
				var message = messages[i];
				var author = message.from.name;
				var div = document.createElement("div");
				if (author != "R2 D2"){
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
				var auth = document.createElement("span");
				pic.setAttribute("class", "profile-pic");
                                auth.setAttribute("style", "float:left;");
                                auth.setAttribute("id", "message-author");
                                auth.innerHTML = author;
                                div.appendChild(auth);
                                var br = document.createElement("br");
                              	div.appendChild(br);
                                t = document.createElement("span");
                                t.className = "message-time";
                                t.setAttribute("style", "float:right;");
                                t.innerHTML = time + " " + ampm + "<br>" + date;
                                div.appendChild(t);
                                var message = document.createElement("div");
                                message.setAttribute("style", "position:relative;");
                                message.setAttribute("id", "message");
                                message.innerHTML = entry;
                                pic.setAttribute("style", "position:relative;display:block;float:left;border-radius:50%;left:10px;bottom:5px;");
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
		}
	});

}

/* Fetch user pictures  */
function getUserPic(id, pic){
	$.ajax({
		type: 'GET', 
		url: 'https://api.hipchat.com/v2/user/' + id + '?auth_token=' + personal_token,
		success: function(resp){
			pic.setAttribute("src", resp.photo_url);
		},
		error: function(error){
			console.log(error.getResponseHeader());
			return '';
		}
	});

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
		token = hc_OAuth();
		localStorage.setItem("hc_token", token);
		console.log("personal token set");	
	}
	else{
		personal_token = localStorage["hc_token"];
		console.log("got from storage")
	}	

}	


/* Hipchat OAuth flow */
function hcOAuth(){
	return personal_token;
}

/* Polls hipchat every 5 seconds, reloading the message board feed if the total number of messages has increases */
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
			setTimeout(pollHipChat, 10000);
			
		},
		error: setTimeout(pollHipChat, 10000)
	});
};
