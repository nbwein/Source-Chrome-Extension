/* Hipchat Message Board JS*/

var personal_token;
var integration_token;
var oauthID = "3885f451-68b5-4a97-aada-1461f5ce7099";
var client_secret = 'cb3s0lg9FuIlB2plZ8ISbhNTRKbm2sBmWV9yewBs';
var group_id = '50006';
var room_id = '1721606';
var room_stats;
var raw_url_regex = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?/gi;
var url_regex = new RegExp(raw_url_regex);
/* Load 10 most recent messages into the message board */
function getHipChat(){
	$.ajax({
		method: 'GET', 
		url: 'https://api.hipchat.com/v2/room/intern-project-message-board/history?auth_token=' + integration_token + "&max-results=10",
		grant_type: 'personal',
		success: function(resp){
			$('.post-message').remove();
			var messages = resp.items;
			var container = document.getElementById("message-board");
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
				try{
					var entry = atob(message.message);
				}
				catch(err){
					var entry = message.message;
				}
				if (entry.indexOf("MESSAGE:") != -1){
					entry = entry.split("MESSAGE:");
					var subject = entry[0];
					entry = entry[1];
					var subject_text = document.createElement("strong");
					subject_text.setAttribute("class", "subject");
					subject_text.innerHTML = "<i>Re: " + subject + "</i>";
				}
				else{
					var subject_text = document.createElement("span");
				}
				var auth = document.createElement("strong");
				auth.setAttribute("id", "message-author");
				auth.innerHTML = author;

				var br = document.createElement("br");
				// div.appendChild(br);

				var pic = document.createElement("img");
				pic.setAttribute("class", "profile-pic");
				getUserPic(message.from.id, pic);
				div.appendChild(pic);

				div.appendChild(auth);
				
				t = document.createElement("p");
				t.className = "message-time";
				t.innerHTML = " &#183 " + time + " " + ampm + ", " + date;
				div.appendChild(t);
				div.appendChild(br);
				div.appendChild(subject_text);
				var message = document.createElement("span");
				message.setAttribute("id", "message");
				if (url_regex.test(entry)){
					var url = entry.match(raw_url_regex);
					for (var k = 0; k<url.length;k++){
						var absolute_path = url[k];
						if((url[k]).indexOf("https") == -1){
							if (url[k].indexOf("www") == -1){
								absolute_path = "www." + absolute_path;
							}
							absolute_path = "https://" + absolute_path;
						}
						var link = document.createElement("a");
						link.setAttribute("href", absolute_path);
						link.innerHTML = url[k];
						link.setAttribute("style", "color:white;");
						entry = entry.split(url[k]);
						message.innerHTML += entry[0];
						message.appendChild(link);
						if (k == (url.length-1)){
						message.innerHTML +=entry[1];
						}
						else{
						entry = entry[1];
						}
					} 

				} 
				else{
					message.innerHTML = entry;
				}
				div.appendChild(message);
				/* Catch and resize image files */
				if (messages[i].message_links != null){
					for (var j = 0; j < messages[i].message_links.length; j++){
						if (messages[i].message_links[j].type == "image"){
							if (messages[i].message_links[j].url.indexOf(".gifv") != -1){
								var gifv = messages[i].message_links[j].url;
								var attatchment = document.createElement("iframe");
								attatchment.setAttribute("class", "inline-pic gifv");
								attatchment.setAttribute("scrolling", "no");
								
							}
							else{
								var attatchment = document.createElement("img");
								attatchment.setAttribute("class", "inline-pic");
							}
							attatchment.setAttribute("src", messages[i].message_links[j].url);
							attatchment.setAttribute("height", "150px");
							attatchment.setAttribute("width", "auto");
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
			if (resp.responseText.indexOf("Unauthorized") != -1) {
                                integrationOAuth();
				getHipChat();
			}

		}
	});

}



/* Fetch user pictures */ 
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
}

/* Send a message to the Hipchat message board and reload the feed */
function postMessage(){
	var post = $("#message-text").val();
	var subject = $("#subject-text").val();
	post = subject + "MESSAGE:" + post; 
	post = btoa(post);
	data = {"message": post};
	data = JSON.stringify(data);
        $.ajax({
                type: 'POST',
                url: 'https://api.hipchat.com/v2/room/intern-project-message-board/message?auth_token=' + personal_token,
		contentType:"application/json; charset=utf-8",
		dataType: "json",
		data: data,
		error: function(resp){
			if (resp.responseText.indexOf("Unauthorized") != -1){
				refreshToken(localStorage.getItem("hc_refresh_token"));
				postMessage();
			}
			else {
				console.log(resp);
			}
		}
	})
	.done(function(resp){
		$("#message-text").val('');
		$("#subject-text").val('');
                getHipChat();
	});

}

/* Checks to see if personal token has already been aquired, if not initiates OAuth flow to aquire one*/
function getHCSession(){
 	if (typeof localStorage["hc_token"] == 'undefined'){
		document.getElementById('dialog').style.display="";
		$("#dialog").css("display", "block");
		$(".content").css("display", "none");
		$("#hc_login").on('click', function(){
		var username = $("#hc_username").val();
		var password = $("#hc_password").val();
		$("#hc_username").val('');
		$("#hc_password").val('');
		document.getElementById('dialog').style.display="none";
		$(".content").css("display", "block");
		hcOAuth(username, password);
		});
		console.log("personal token set");	
	}
	else{
		personal_token = localStorage["hc_token"];
		integration_token = localStorage["integration_token"];
		getHipChat();
		pollHipChat();
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
		},
		error: function(resp){
			console.log(resp);
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
		success: function(resp) {
			curr_messages = resp.messages_sent;
			if (typeof room_stats == 'undefined'){
				room_stats = resp.messages_sent;
			}
			else if (curr_messages > room_stats){
				room_stats = curr_messages
                		getHipChat();
			}
			setTimeout(pollHipChat, 10000);			
		},
		error: function(resp) {
			console.log(resp);
			if (resp.responseText.indexOf("Unauthorized") != -1){
				integrationOAuth();
			}
			setTimeout(pollHipChat, 10000);
		}
	});
};
