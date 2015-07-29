function getJobs(){	
//	getNewHireInfo();
	makeRequest().done(function(data) {
		var nycjobs = data.offices[2];
		var joblist = "";
		for (var i = 0; i < nycjobs.departments.length; i++){
			var dep = nycjobs.departments[i];
			if (dep.jobs.length > 0){
				joblist = joblist + "<br><b>" + dep.name + "</b><br>";
				for (var j = 0; j < dep.jobs.length; j++){
					joblist = joblist + "<a style=\"color:white;\" href =\"" + dep.jobs[j].absolute_url + "\">" + dep.jobs[j].title + "</a><br>";
				}

			}
		}
		joblist = joblist + "<br><br>"
		document.getElementById("job-list").innerHTML = joblist;
	});

}

function makeRequest(){
        return $.ajax({
                method: "GET",
                url: "https://api.greenhouse.io/v1/boards/stellaservice/embed/offices",
                datatype: "json"
        });


}

/*function getNewHireInfo(){
	$.ajax({
		method: "GET",
		url: "https://docs.google.com/spreadsheets/d/1eeOhUe8TJg2P9oFe9pWXh7YQfjFTYihHQEf9VZOBJ6Q/pub?gid=268625726&single=true&output=csv",
		error: function(resp){
			console.log(resp);
		},
		success: function(resp){
			resp.split("\n");
			console.log(resp);
		}
	});
}*/
