'use strict';

/*var googlePlusUserLoader = (function() {

  var STATE_START=1;
  var STATE_ACQUIRING_AUTHTOKEN=2;
  var STATE_AUTHTOKEN_ACQUIRED=3;

  var state = STATE_START;

  var signin_button, xhr_button, revoke_button, user_info_div;

 function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
  }

  function enableButton(button) {
    button.removeAttribute('disabled');
  }

  function changeState(newState) {
    state = newState;
    switch (state) {
      case STATE_START:
        enableButton(signin_button);
        disableButton(xhr_button);
        disableButton(revoke_button);
        break;
      case STATE_ACQUIRING_AUTHTOKEN:
        sampleSupport.log('Acquiring token...');
        disableButton(signin_button);
        disableButton(xhr_button);
        disableButton(revoke_button);
        break;
      case STATE_AUTHTOKEN_ACQUIRED:
        disableButton(signin_button);
        enableButton(xhr_button);
        enableButton(revoke_button);
        break;
    }
  }*/


var googlePlusUserLoader  = (function() {
function xhrWithAuth(method, url, interactive, callback) {
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
        requestStart();
      });
    }

    function requestStart() {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      xhr.onload = requestComplete;
      xhr.send();
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
                onUserInfoFetched);
  }

  function onUserInfoFetched(error, status, response) {
    if (!error && status == 200) {
      //changeState(STATE_AUTHTOKEN_ACQUIRED);
      //sampleSupport.log(response);
      var user_info = JSON.parse(response);
      populateUserInfo(user_info);
    } else {
      console.log(response);
      console.log("error on user info fetch");
	//changeState(STATE_START);
    }
  }

  function populateUserInfo(user_info) {
    main_greeting.innerHTML = "Welcome, " + user_info.name.givenName;
  }

return{
	onload: function() {
		getUserInfo(false);
		showTime();
	}
};
})();

//function ShowTime(){
        //var dt = new Date();
     	//cument.getElementById("main_greeting").innerHTML = "hello";
	//var date = new Date();
	//date = date.toLocaleString();
	//var elements = date.split(",");
	//var time = elements[0];
	//var date = elements[1];
        //document.write('<h2 id="date-time" align="center">', time , '<\/h2>');
	//document.write('<h2 id="date-time" align="center">', date , '<\/h2>');
 // }




window.onload = googlePlusUserLoader.onload;

