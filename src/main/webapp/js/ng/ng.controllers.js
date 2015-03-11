angular.module("app.controllers", []).factory("settings", ["$rootScope",
	function(a) {
		var b = {
			languages: [{
				language: "Español",
				translation: "Spanish",
				langCode: "es",
				flagCode: "es"
			},{
              	language: "English",
              	translation: "English",
                langCode: "en",
              	flagCode: "us"
             }
			]
		};
		return b
	}
]).controller("cityReportDashboardController", ["$rootScope", "$scope",
	function(a, b) {


		b.username='anonymous';


	}
]).controller("LangController", ["$scope", "settings", "localize",
	function(b, c, a) {
		b.languages = c.languages;
		b.currentLang = c.currentLang;
		b.setLang = function(d) {
			c.currentLang = d;
			b.currentLang = d;
			a.setLang(d)
		};
		b.setLang(b.currentLang)
	}
]).controller("ActivityDemoCtrl", ["$scope",
	function(a) {
		var b = this;
		b.getDate = function() {
			return new Date().toUTCString()
		};
		a.refreshCallback = function(d, c) {
			console.log(d);
			setTimeout(function() {
				c()
			}, 3000);
			a.footerContent = b.getDate()
		};

		a.total = 0;
		/*
		angular.forEach(a.items, function(c) {
			a.total += c.count
		});
		*/
		a.footerContent = b.getDate();

        connectNotificationService(a);



	}
]);


cityReportDashboard.controller('LoginController', function($scope, $location, $state, AuthenticationService, SessionService) {

	'use strict';

	$scope.credentials = {
		username: '',
		password: ''
	};

	//Destroy all previous sessions
	SessionService.destroy();

	$scope.loginUser = function(credentials) {


		$('#error_message').html('').hide();

		SessionService.destroy();

		AuthenticationService.login(credentials, function(result) {
			if (AuthenticationService.isLoggedIn()) {
				//determinar role del usuario
				//routear a dashboard o a home segun corresponda
				var view = "main.dashboard";
				$state.transitionTo(view);
			}
		});


	};



	$scope.socialLogin = function(provider) {


		if (provider == 'facebook') {

			FB.login(function(response) {
				console.log(response)
				if (response.authResponse) {

					AuthenticationService.loginSocial(response.authResponse.accessToken, function(error) {
						if (error)
							console.log(error)
						else {

							var view = "main.dashboard";
							$state.transitionTo(view);

						}
					})
					console.log('Welcome!  Fetching your information.... ');
					FB.api('/me', function(response) {
						console.log('Good to see you, ' + response.name + '.');
					});
				} else {
					console.log('User cancelled login or did not fully authorize.');
				}
			}, {scope: 'email'});

		} else {
			console.log('Social provider not implemented!');

		}


	}



});

cityReportDashboard.controller('DashController', function($rootScope, $scope, $location, $state, UserService, SessionService, RoleService) {

	'use strict';

	completeDashBoardScreen($rootScope, $scope, UserService, SessionService, RoleService);


	$scope.logout = function() {

		SessionService.destroy();
		var view = "login";
		$state.transitionTo(view);


	}

});

function connectNotificationService(b){

    var wsUrl= 'ws://api.citylink.leadprogrammer.com.ar:8000/cityReportService/events';
    console.log('WebSockets Url : ' + wsUrl);
    var ws = new WebSocket(wsUrl);

    ws.onopen = function(event){
        console.log('WebSocket connection started');
    };

    ws.onclose = function(event){
         console.log("Remote host closed or refused WebSocket connection");
         console.log(event);
    };

    ws.onmessage = function(event){
        console.log(event.data);

        var initHtml='<ul class="notification-body"><li><span class="padding-10 unread"><em class="badge padding-5 no-border-radius bg-color-blueLight pull-left margin-right-5"><i class="fa fa-user fa-fw fa-2x"></i></em><span class="text-primary">';

        var endHtml='</span></span></li></ul>';

        var message = JSON.parse(event.data).data.message;

         $('.ajax-notifications').append(initHtml+message+endHtml);

        b.total= b.total +1;

    };

    $("#send").on('click',function(){
        var message = $('textarea#message').val();
        console.log('Input message .. '+message);
        ws.send(message);
    });

}



function completeDashBoardScreen($rootScope, $scope, UserService, SessionService, RoleService) {

	//Complete user information

	UserService.getUserInfo(function(user) {

		SessionService.fillUserInfo(user);
		$scope.username = SessionService.currentUser.userName;

	});


}


cityReportDashboard.controller('CategoryController', function($scope, $state, CategoryService, RoleService) {

	'use strict';

	$scope.categories = {};
	$scope.myData = [];
	$scope.gridOptions = {
		data : 'myData',
		columnDefs : [ {
			field : 'name',
			displayName : 'Name',
  cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a  href="javascript:void(0);"  ng-click="editCategory(row.entity)" >{{row.getProperty(col.field)}}</a></div>'
		}, {
			field : 'description',
			displayName : 'Description'
		}, {
			field : 'categorygroup.name',
			displayName : 'Father'
		},
        ],
         selectedItems: $scope.mySelections,
         multiSelect: false
	};

		$scope.editCategory = function(report) {

    		$state.transitionTo("main.openCategory");
    	};


	CategoryService.queryCagegories(function(categories) {

		$scope.categories = categories;

        if(categories!=null){
		for (var i = 0; i < categories.length; i++) {
			if (categories[i].categorygroup == null) {

				categories[i].categorygroup = {
					name : 'N/A'
				};
			}
		}

        }
		$scope.myData = categories;
		$scope.$apply();
	});

});



cityReportDashboard.controller('OpenCategoryController', function($scope, $state, CategoryService, RoleService) {

	'use strict';



});




cityReportDashboard.controller('ReportController', function($scope, $state,
		ReportService, RoleService) {

	'use strict';

	$scope.reports = {};
	$scope.myData = [];
	$scope.mySelections = [];
	$scope.gridOptions = {
		data : 'myData',
		columnDefs : [ {
			field : 'category.name',
			displayName : 'Categoría',
			groupable: true
		}, {
			field : 'status',
			displayName : 'Estado'
		}, {
			field : 'priority',
			displayName : 'Prioridad'
		}, {
			field : 'location.address',
			displayName : 'Dirección'
		}, {
			field : 'description',
			displayName : 'Descripción'
		}, {
			field : 'creationDate',
			displayName : 'Fecha'
		}, {
			displayName: 'Gestionar',
			cellTemplate: '<button id="editBtn" type="button" ng-click="editReport(row.entity)" class="btn btn-primary btn-xs"><i class="fa fa-folder-open"></i> Abrir</button>'
		} ],
		selectedItems: $scope.mySelections,
		multiSelect: false,
		showColumnMenu: true,
	    showGroupPanel: true
//	    , groups: ["category.name"]
	};
	
	$scope.editReport = function(report) {
//		$scope.selectedItemReport = report;
		ReportService.setSelectedItemReport(report);
		$state.transitionTo("main.openReport");
	};

	ReportService.queryReports(function(reports) {
		$scope.reports = reports;
		$scope.myData = reports;
		$scope.$apply();
	});
});


cityReportDashboard.controller('OpenReportController', function($scope,
		ReportService, ImageService, RoleService) {
	
	'use strict';
	
	$scope.report = ReportService.getSelectedItemReport();
	if ($scope.report) {
		$scope.imgUrl = ImageService.getImage($scope.report.imageUrl);
	}
	
	var marker;
	
	$data_lat = $scope.report.location.latitude;
    $data_lng = $scope.report.location.longitude;
	$zoom_level = 17;
//	console.log("$data_lat: " + $data_lat);
    console.log("$data_lng: " + $data_lng);


    var centerLatLng = new google.maps.LatLng($data_lat, $data_lng),
    mapOptions = {
        zoom: $zoom_level,
        center: centerLatLng,
        //disableDefaultUI: true,
        //mapTypeId : google.maps.MapTypeId.ROADMAP
	    mapTypeControlOptions: {
	      mapTypeIds: [google.maps.MapTypeId.SATELLITE , google.maps.MapTypeId.ROADMAP],
	    }
    },

    bounds = new google.maps.LatLngBounds(),
    infowindow = new google.maps.InfoWindow(),
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	
	marker = new google.maps.Marker({
	position : new google.maps.LatLng($data_lat, $data_lng),
	map : map,
	icon : ('img/sa-default.png'),
	scrollwheel : false,
	streetViewControl : true,
	title : "titulo"
	}),
					
	google.maps.event.addListener(marker, 'click', function() {// click
		// Setting the content of the InfoWindow
		var contentString = '<div id="info-map" style="width:300px; height:85px; padding:0px;"><div>' + '<div style="display:inline-block; width:200px; float:left;"><b>' + $scope.report.location.address + '</b><br/>' + '</div></div></div>';
		infowindow.setContent(contentString);
		infowindow.open(map, marker);

		google.maps.event.addListener(map, 'click', function() {
			infowindow.close()
			})
		});

});


cityReportDashboard.controller('SignUpController', function($scope, $state, UserService) {

	'use strict';

	/*
      if (javaRest.user.is_logged_in())
        window.location = 'dashboard.html'
*/

	$scope.newUser = {
		firstName: '',
		lastName: '',
		emailAddress: '',
		password: ''
	};
	$scope.email='';


	$scope.createUser = function(newUser) {
		UserService.createUser(newUser.firstName, newUser.lastName, newUser.emailAddress, newUser.password, function(error) {


			if (!error) {
				var view = "main.dashboard";
				$state.transitionTo(view);

			} else {
				console.log(error)
				if (error.status == '409')
					$('#error_message').html('Email already registered.').show()
				else
					$('#error_message').html('Please fix your email address/password.').show()
			}

		});
	}
	
	$scope.resetPassword = function(email){
	
	      if (javaRest.user.is_logged_in())
        window.location = 'dashboard.html'
      $('#login_button').on('click', function () {
        javaRest.user.send_reset_email($('#email').val(), function (error) {
          if (!error)
            window.location = 'index.html'
          else {
            console.log(error)
            $('#error_message').html('Email address not found.').show()
          }
        })
      })

	
	}
	

});