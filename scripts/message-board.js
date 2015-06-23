/* Javascript for the message board */
/*function loadXMLDoc(url)
{i
var xmlhttp;
xmlhttp = new XMLHttpRequest();
if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	console.log("got it");
}
xmlhttp.open("GET",url,true);
xmlhttp.send();
}*/
 
function loadFeed(){
	var rand = Math.trunc(Math.random() * 10000);
	console.log(rand);
	var url = 'https://groups.google.com/forum/feed/test-feed/msgs/rss_v2_0';
	url = url + '?nocache=' + rand.toString();
	var feed = new google.feeds.Feed(url);
	feed.setNumEntries(100);
	feed.includeHistoricalEntries();
	console.log(feed);
	feed.load(function(result) {
		if(!result.error){
			console.log(result);
			//console.log(result.feed.entries.length);
			var container = document.getElementById("message-board");
			for (var i = 0; i < result.feed.entries.length; i++) {
				console.log("in loop");
				var entry = result.feed.entries[i];
				var div = document.createElement("div");
				div.appendChild(document.createTextNode(entry.content));
				div.className = "post";
				if (i == 0){
					div.setAttribute("style", "border-top-left-radius: 15px; border-top-right-radius: 15px");
				}
				container.appendChild(div);
			}
		}
		else{
		console.log(":(", result.error);
		}
	});	
}

