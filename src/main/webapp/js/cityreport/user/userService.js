restWrapper.user = {};
restWrapper.hostUrl = 'http://api.microservices.tk/cityReportService/';


cityReportDashboard.factory('UserService', function ($http) {

  'use strict';

  return {

  			getUserId : function (){
  				return restWrapper.cookie.get('userId');

  			},
  			getUserToken : function (){
  				return restWrapper.cookie.get('token');
  			},

		   createUser : function (firstName, lastName, emailAddress, password, callback) {

		   restWrapper.post(
			restWrapper.hostUrl+'rest/user',
			{user :
			  {
				"firstName" : firstName,
				"lastName" : lastName,
				"emailAddress" : emailAddress
			  },
			"password" : password
			},
			function (response) {
			  restWrapper.cookie.set('token', response.token);
			  restWrapper.cookie.set('userId', response.userId);
			  restWrapper.cookie.set('email', emailAddress);
			  callback();
			},
			function(jqXHR, textStatus) {
			  console.log(jqXHR);
			  callback(jqXHR);
			});

		},

		queryUserInfo: function (callback) {
			restWrapper.get(
			restWrapper.hostUrl+'rest/user/' + restWrapper.cookie.get('userId'),
			{},
			function (response) {
			  console.log(response);
			  // If the cached version is the same as the most recent
			  // version, just return. Else, we will run the callback.
			  if (store.get('userResponse') === JSON.stringify(response)) {
				console.log('cached');
				return false;
			  }


			  store.set('userResponse', JSON.stringify(response));

			  if (callback)
				callback(response.user);
			},
			function(jqXHR, textStatus) {
			  if (callback)
				callback(null);
			});

		},

		getUserInfo: function (callback) {
		  var userResponse = store.get('userResponse');

		  if (userResponse) {
			var response = JSON.parse(userResponse);
			// We still download the latest data in the background to make sure
			// cache is current. But we return immediately.
			this.queryUserInfo(callback);
			return callback(response.user);
		  }


		  this.queryUserInfo(callback);

		},
		is_logged_in : function () {
		  return !!restWrapper.cookie.get('token');
		},

		login : function (email, password, callback) {
		  restWrapper.post(
			restWrapper.hostUrl+'rest/user/login',
			  {
			  "username" : email,
			  "password" : password
			  },
			function (response) {
			  restWrapper.cookie.set('token', response.token);
			  restWrapper.cookie.set('userId', response.userId);
			  restWrapper.cookie.set('email', email);
			  callback('OK',{'token':response.token, 'userId':response.userId});

			},
			function(jqXHR, textStatus) {
			  callback('ERROR',jqXHR);
			});

		},

		loginSocial : function (accessToken, callback) {
		  restWrapper.post(
			restWrapper.hostUrl+'rest/user/login/facebook',
			  {
			  "accessToken" : accessToken
			  },
			function (response) {
			  restWrapper.cookie.set('token', response.token);
			  restWrapper.cookie.set('userId', response.userId);
			  callback();

			},
			function(jqXHR, textStatus) {
			  callback(jqXHR);
			});

		},
		
		logout : function () {
		  restWrapper.cookie.remove('token');
		  restWrapper.cookie.remove('userId');
		  restWrapper.cookie.remove('email');
		  store.clear();
		},
		
		reset_password : function (token, password, callback) {
		  restWrapper.post(
			restWrapper.hostUrl+'rest/password/tokens/' + token,
			  {
			  "password" : password
			  },
			function (response) {
			  callback();
			},
			function(jqXHR, textStatus) {
			  callback(jqXHR);
			});
		},

		send_reset_email : function (email, callback) {
		  restWrapper.post(
			restWrapper.hostUrl+'rest/password/tokens',
			  {
			  "emailAddress" : email
			  },
			function (response) {
			  callback();

			},
			function(jqXHR, textStatus) {
			  callback(jqXHR);
			});
		},

		updateName : function (value, callback) {
		  restWrapper.put(
			restWrapper.hostUrl+'rest/user/' + restWrapper.cookie.get('userId'),
			  {
			  "emailAddress" : restWrapper.cookie.get('email'),
			  "firstName" : value
			  },
			function (response) {
			  console.log(response);
			  if (callback)
				callback();
			  // Clear user cache
			  queryUserInfo();
			},
			function(jqXHR, textStatus) {
			  if (callback)
				callback(jqXHR);
			  // Clear user cache
			  queryUserInfo();
			});
		}
  };  
});