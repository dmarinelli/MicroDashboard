cityReportDashboard.factory('ReportService', function($http) {

		'use strict';
		var report;

		return {

//			getReportById: function() {
//				return restWrapper.cookie.get('userId');
//
//			},
			setSelectedItemReport: function(value) {
				report = value;
			},
			
			getSelectedItemReport: function() {
				return report;
			},
			
			queryReports: function(callback) {
				restWrapper.get(
					restWrapper.hostUrl + 'rest/report/all/', {},
					function(response) {
						console.log(response);
						// If the cached version is the same as the most recent
						// version, just return. Else, we will run the callback.
						if (store.get('reportResponse') === JSON.stringify(response)) {
							console.log('cached');



//For testing
							callback(response.reports);
		//						return false;
						}


						store.set('reportResponse', JSON.stringify(response));

						if (callback)
							callback(response.reports);
					},
					function(jqXHR, textStatus) {
						if (callback)
							callback(null);
					});

			},

			getReports: function(callback) {
				var reportResponse = store.get('reportResponse');

				if (reportResponse) {
					var response = JSON.parse(reportResponse);
					// We still download the latest data in the background to make sure
					// cache is current. But we return immediately.
					this.queryReports(callback);
					return callback(response.reports);
				}


				this.queryReports(callback);

			},

		}
	});