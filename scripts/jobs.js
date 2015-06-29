function getJobs(){	
	makeRequest().done(function(data) {
		var nycjobs = data.offices[2];
		var joblist = "";
		for (var i = 0; i < nycjobs.departments.length; i++){
			var dep = nycjobs.departments[i];
			if (dep.jobs.length > 0){
				joblist = joblist + "<br><b>" + dep.name + "</b><br>";
				for (var j = 0; j < dep.jobs.length; j++){
					joblist = joblist + dep.jobs[j].title + "<br>";
				}

			}
		}
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
