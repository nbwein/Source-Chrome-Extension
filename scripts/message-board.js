/* Javascript for the message board */


/* Load the RSS feed from Google Groups, display in the message board */
function loadFeed(){
	var rand = Math.trunc(Math.random() * 10000);
	console.log(rand);
	$.ajax({
		method: "GET",
		url: "https://groups.google.com/forum/feed/test-feed/msgs/rss_v2_0",
		dataType: "html",
		success:function(data){
			data.replace('</item>', '');
			var items = data.split("<item>");
			delete items[0];
			var container = document.getElementById("message-board");
			for (var i = 1; i < items.length; i++){
				var elements = items[i].split("</title>");
				var subject = elements[0].replace("<title>", "");
				if (subject != "Lunch"){
					var description = elements[1].split("<description>")[1].split("</description>")[0];
					var entry = description;
					var author = elements[1].split("<author>")[1].split("</author>")[0];
					author = author.split("@")[0];
					author = author.replace(".", " ");
					console.log(author); 
					var div = document.createElement("div");
					entry = entry.replace(/&amp;/g, "&");
					entry = entry.replace(/&apos;/g, "\'");
					entry = entry.replace(/&quot;/g, "\"");
					var auth = document.createElement("span");
					auth.setAttribute("style", "float:left;");
					auth.setAttribute("id", "message-author");
					auth.innerHTML = author + ":";
					div.appendChild(document.createTextNode(entry));
					div.appendChild(auth);
					div.className = "post";
					if (i == 0) {
						div.setAttribute("style", "border-top-left-radius: 15px; border-top-right-radius: 15px");
					}
					div.setAttribute("align","center");
					container.appendChild(div);
				}
			}
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
