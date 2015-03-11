cityReportDashboard.factory('RoleService', function($http, UserService, SessionService) {


  roles: [
    'public',
    'user',
    'admin'
  ];


  'use strict';

  var adminRoles = ['admin', 'editor'];
  var otherRoles = ['user'];

  return {
    validateRoleAdmin: function(currentUser) {
      return currentUser ? _.contains(adminRoles, currentUser.role) : false;
    },

    validateRoleOther: function(currentUser) {
      return currentUser ? _.contains(otherRoles, currentUser.role) : false;
    }

  };
});

cityReportDashboard.factory('AuthenticationService', function($http, SessionService, UserService, RoleService) {

  'use strict';

  return {

    login: function(credentials, callback) {


      UserService.login(credentials.username, credentials.password, function(status, reponse) {
        if (status == "OK") {
          SessionService.create(reponse.token, reponse.userId);

        } else {
          console.log(reponse)
          $('#error_message').html('Email and/or password did not match a user account.').show()
        }
        callback();

      });



      //SessionService.currentUser = user;
    },
    logout: function() {

      UserService.logout();

    },

    isLoggedIn: function() {

      return SessionService.id !== null;
    },
    loginSocial: function(token , callback){

      UserService.loginSocial(token, callback);
    }



  };
});


cityReportDashboard.factory('SessionService', function($rootScope, UserService) {

    this.id = null;
    this.userId = null;
    this.currentUser = null;
    this.isLoggedIn = false;

    this.create = function(sessionId, userId) {
      this.id = sessionId;
      this.userId = userId;
      this.currentUser = null;
      this.isLoggedIn = true;

    };

    this.destroy = function() {
      this.id = null;
      this.userId = null;
      this.userRole = null;
      this.currentUser = null;
      this.isLoggedIn = false;

      UserService.logout();

    };


    this.recoverSession = function(callback) {


      if (UserService.getUserToken() != null && UserService.getUserId() != null) {

        this.create(UserService.getUserToken(), UserService.getUserId());

      }

      callback();

    };

    this.fillUserInfo = function(user) {


      if (user != null) {
        this.currentUser = {
          'userId': user.id,
          'userRole': user.role,
          'userName': user.name,
          'firstName': user.firstName,
          'lastName': user.lastName,
          'emailAddress': user.emailAddress,
          'verified': user.verified
        };
      }


    };

  $rootScope.session = this;

  return this;
})