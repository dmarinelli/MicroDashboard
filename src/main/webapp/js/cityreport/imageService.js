cityReportDashboard.factory('ImageService', function($http) {

	'use strict';

	return {
		getImage : function(img) {
			var url;

			if (!img || 0 === img.length) {
				url = "/webapp/img/not_img.png";
			} else {
				url = restWrapper.hostUrl + 'rest/image/' + img;
			}

			return url;
		}
	}
});