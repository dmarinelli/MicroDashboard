cityReportDashboard.config(function($stateProvider, $urlRouterProvider, $provide) {

  'use strict';

  $urlRouterProvider.otherwise('/main/dashboard');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'views/cityreport/user/signup.html',
      controller: 'SignUpController'
    })
	.state('forgot_password', {
      url: '/forgot_password',
      templateUrl: 'views/cityreport/user/forgot_password.html',
      controller: 'SignUpController'
    })
  .state('main', {
    url: '/main',
    templateUrl: 'views/main.html',
    controller: 'DashController'
  })
  .state('main.dashboard', {
    url: '/dashboard',
    templateUrl: 'views/dashboard.html'
  })
  .state('main.categories', {
    url: '/categories',
    templateUrl: 'views/cityreport/categories/categories.html',
    controller: 'CategoryController'
  })
  .state('main.openCategory', {
    url: '/openCategory',
    templateUrl: 'views/cityreport/categories/openCategory.html',
    controller: 'OpenCategoryController',
  })

  .state('main.users', {
	  url: '/users',
	  templateUrl: 'views/cityreport/users.html',
//	  controller: 'UserController'
  })
  .state('main.reports', {
    url: '/reports',
    templateUrl: 'views/cityreport/reports.html',
    controller: 'ReportController'
  })
  .state('main.openReport', {
    url: '/openReport',
    templateUrl: 'views/cityreport/openReport.html',
    controller: 'OpenReportController',
//    data:{ pageTitle: 'Reporte'}
  })
  .state('main.news', {
	  url: '/news',
	  templateUrl: 'views/cityreport/news.html',
//	  controller: 'NewsController'
  })
  .state('main.notifications', {
    url: '/notifications',
    templateUrl: 'views/cityreport/notifications.html',
//    controller: 'NotificationsController'
  })
  .state('admin', {
    url: '/admin',
    templateUrl: 'views/dashboard.html',
    controller: 'AppController'
  })

  .state('error', {
    url: '/error',
    templateUrl: 'views/error.html',
    controller: 'AppController'
  })

  .state('main.:page', {
    url: '/:page',
    templateUrl: function($stateParams) {
      return 'views/' + $stateParams.page + '.html';
    }
  })

  .state('main.child', {
    url: '/:page/{child:.*}',
    templateUrl: function($stateParams) {
      return 'views/' + $stateParams.page + '/' + $stateParams.child + '.html';
    }
  });

  // with this, you can use $log('Message') same as $log.info('Message');
  $provide.decorator('$log', function($delegate) {
    // create a new function to be returned below as the $log service (instead of the $delegate)
    function logger() {
      // if $log fn is called directly, default to "info" message
      logger.info.apply(logger, arguments);
    }
    // add all the $log props into our new logger fn
    angular.extend(logger, $delegate);
    return logger;
  });



});

cityReportDashboard.run(function($rootScope, $location, $state, AuthenticationService, RoleService, SessionService, settings) {

  settings.currentLang = settings.languages[0]; // es

  'use strict';

  // enumerate routes that don't need authentication
  var routesThatDontRequireAuth = ['/login','/signup', '/forgot_password'];
  var routesForAdmin = ['/admin'];

  // check if current location matches route  
  var routeClean = function(route) {
    return _.find(routesThatDontRequireAuth,
      function(noAuthRoute) {
        return startsWith(route, noAuthRoute);
      });
  };

  // check if current location matches route  
  var routeAdmin = function(route) {
    return _.find(routesForAdmin,
      function(noAuthRoute) {
        return startsWith(route, noAuthRoute);
      });
  };

  $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
    // if route requires auth and user is not logged in

    if (!routeClean($location.url()) && !AuthenticationService.isLoggedIn()) {

      SessionService.recoverSession(function(result) {

        if (!AuthenticationService.isLoggedIn()) {
          // redirect back to login
          ev.preventDefault();
          $location.path('/login');
          $state.transitionTo('login');
        }

      });


    } else if (routeAdmin($location.url()) && !RoleService.validateRoleAdmin(SessionService.currentUser)) {
      // redirect back to login
      ev.preventDefault();
      $location.path('/error');
      $state.transitionTo('error');
    }
  });
});

function startsWith(str, substr) {

  return (str.indexOf(substr) == 0);

}