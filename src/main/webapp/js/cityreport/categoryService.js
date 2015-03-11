cityReportDashboard.factory('CategoryService', function($http) {

		'use strict';

		return {

			getCategoryById: function() {
				return restWrapper.cookie.get('userId');

			},

			queryCagegories: function(callback) {
				restWrapper.get(
					restWrapper.hostUrl + 'rest/category/', {},
					function(response) {
						console.log(response);
						// If the cached version is the same as the most recent
						// version, just return. Else, we will run the callback.
						if (store.get('categoryResponse') === JSON.stringify(response)) {
							console.log('cached');



//For testing
							callback(response.categories);
		//						return false;
						}


						store.set('categoryResponse', JSON.stringify(response));

						if (callback)
							callback(response.categories);
					},
					function(jqXHR, textStatus) {
						if (callback)
							callback(null);
					});

			},

			getCategories: function(callback) {
				var categoryResponse = store.get('categoryResponse');

				if (categoryResponse) {
					var response = JSON.parse(categoryResponse);
					// We still download the latest data in the background to make sure
					// cache is current. But we return immediately.
					this.queryCagegories(callback);
					return callback(response.categories);
				}


				this.queryCagegories(callback);

			},

		}
	});