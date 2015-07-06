/* Javascript for the message board */


/* Load the RSS feed from Google Groups, display in the message board */
function loadFeed(){
	var rand = Math.trunc(Math.random() * 10000);
	$.ajax({
		method: "GET",
		url: "https://groups.google.com/forum/feed/test-feed/msgs/rss_v2_0",
		dataType: "html",
		success:function(data){
			data.replace('</item>', '');
			var items = data.split("<item>");
			delete items[0];
			var container = document.getElementById("message-board");
			var lastDay = "today";
			var todayPrinted = false;
			for (var i = 1; i < items.length; i++){
				var elements = items[i].split("</title>");
				var subject = elements[0].replace("<title>", "");
				if (subject != "Lunch"){
					var pubdate = elements[1].split("<pubDate>")[1].split("</pubDate>")[0];
					var ampm = "am";
					var datetime= pubdate.split(/\d{4}/);
					var time = datetime[1];
					time = time.split(":");
					time[0] = time[0] - 4;
					if (time[0] > 12){
						time[0] = time[0] - 12;
						ampm = "pm";
					}
					time = time[0] + ":" + time[1];
					var today = new Date();
					today.setHours(0,0,0,0);
					today = today.toString();
					date = Date.parse(pubdate);
					date = new Date(date);
					date = new Date(date.setHours(0,0,0,0));
					if (today == date){
						var day = "today";
						if (!todayPrinted){
							var div = document.createElement("div");
                                                	div.appendChild(document.createTextNode(day));
                                                	container.appendChild(div);
							div.className = "date-bar";
							todayPrinted = true;
						}
					}
					else {
						var day = datetime[0];
					}
					if (day != lastDay){
						var div = document.createElement("div");
						div.appendChild(document.createTextNode(day));
						container.appendChild(div);
						div.className = "date-bar"
						lastDay = day;
					}				
					var description = elements[1].split("<description>")[1].split("</description>")[0];
					var idparse = description.split("user_id: ");
					var id = idparse[1];
					var entry = idparse[0];
					var author = elements[1].split("<author>")[1].split("</author>")[0];
					author = author.split("@")[0];
					author_split = author.split(".");


					if (typeof author_split[1] != 'undefined'){
						author_split[0] = author_split[0][0].toUpperCase() + author_split[0].slice(1); 
						author_split[1] = author_split[1][0].toUpperCase() + author_split[1].slice(1);
						author = author_split[0] + " " + author_split[1]; 
					}

					var div = document.createElement("div");
					entry = entry.replace(/&amp;/g, "&");
					entry = entry.replace(/&apos;/g, "\'");
					entry = entry.replace(/&quot;/g, "\"");
					var auth = document.createElement("span");
					var pic = document.createElement("img");
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
					t.innerHTML = time + " " + ampm;
					div.appendChild(t);
					// div.appendChild(document.createTextNode(entry)); 
					var message = document.createElement("span");
					message.setAttribute("style", "position:relative; padding-top: 10px");
					message.innerHTML = entry;
					div.appendChild(message);
					div.className = "post";

					if (i == 0) {
						div.setAttribute("style", "border-top-left-radius: 15px; border-top-right-radius: 15px");
					}

					div.setAttribute("align","left");
					container.appendChild(div);

					if (typeof(id) != 'undefined') {
						$.ajax({
							method : 'GET',
							url: 'https://www.googleapis.com/plus/v1/people/' + id,
							async: false,
							beforeSend: function(xhr, settings) {
								xhr.setRequestHeader('Authorization','Bearer ' + access_global);
							}
						})
						.done(function(data) {
							pic.setAttribute("src", data.image.url);
							pic.setAttribute("style", "position:relative;display:block;float:left;border-radius:50%;left:10px;bottom:5px");
							div.appendChild(pic);
							div.className = "post";
							if (i == 0) {
								div.setAttribute("style", "border-top-left-radius: 15px; border-top-right-radius: 15px");
							}
							div.setAttribute("align","center");
							container.appendChild(div);

						});

					}
					else {
						div.className = "post";
						if (i == 0) {
							div.setAttribute("style", "border-top-left-radius: 15px; border-top-right-radius: 15px");
						}
						div.setAttribute("align","center");
						container.appendChild(div);
					}
				}
			}
			}
	});

}


function getProfilePicture(id){
	var url;
	$.ajax({
		method : 'GET', 
		url: 'https://www.googleapis.com/plus/v1/people/' + id, 
		beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('Authorization','Bearer ' + access_global);
                },
		success: function(resp){
			 url = resp.image.url;
		},
		error: function(resp){
			return '';
		}
	});
}

function addMessage(msg) {
	var container = document.getElementById("message-board");
	var div = document.createElement("div");
	div.appendChild(document.createTextNode(msg));
	div.className = "post";
	container.appendChild(div);
}
