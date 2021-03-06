

var ipvsstate_app = angular.module('ipvsstate', [,'ng.django.forms']).config([
	'$httpProvider',
	'$interpolateProvider',
    function($httpProvider, $interpolateProvider) {
	 $interpolateProvider.startSymbol('{$');
	 $interpolateProvider.endSymbol('$}');
	 $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	}
]);
	

ipvsstate_app.filter('bytes', [function () {
	return function(bytes, precision) {
		if (typeof bytes !== 'number') {
			bytes = parseFloat(bytes);
		}
		if (bytes === 0) {
			return '0 B';
		} else if (isNaN(bytes) || !isFinite(bytes)) {
			return '-';
		}
		var isNegative = bytes < 0;
		if (isNegative) {
			bytes = -bytes;
		}
		if (typeof precision !== 'number') {
			precision = parseFloat(precision);
		}
		if (isNaN(precision) || !isFinite(precision)) {
			precision = 1;
		}
		var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
		var number = (bytes / Math.pow(1024, Math.floor(exponent))).toFixed(precision);
		return (isNegative ? '-' : '') + number + ' ' + units[exponent];
		};
}]);

ipvsstate_app.factory('dataFactory',['$http',function($http){
	var dataFactory = {};
	
    dataFactory.getNics = function () {
        return $http.get('/ipvsstat/ajax/nicdashboard');
    };
	
    dataFactory.getSystem = function () {
        return $http.get('/ipvsstat/ajax/dashboard');
    };
    
    dataFactory.getIpvsadm = function () {
        return $http.get('/ipvsstat/ajax/ipvsadm');
    };
    
    return dataFactory;
}]);

ipvsstate_app.controller('nicTableCtrl',['$scope','$timeout','dataFactory',function($scope,$timeout,dataFactory) {
	$scope.nics;
		
    function getNics(){
    	dataFactory.getNics().success(function(data){
        	$scope.nics = data;
        }).error(function (error) {
        	;
        });
    	$timeout(getNics, 5000);
    }
	getNics();    
}]);

ipvsstate_app.controller('sysinfoCtrl',['$scope','$timeout','dataFactory',function($scope,$timeout,dataFactory) {
	$scope.sysinfo = [];
	
	var success = function(data){
		$scope.sysinfo = data;
    };
	
    function getSysinfo(){
    	dataFactory.getSystem().success(success);
    	$timeout( getSysinfo, 5000);
    }
    
    getSysinfo();
}]);

ipvsstate_app.controller('ipvsadminCtrl',['$scope','$timeout','dataFactory',function($scope,$timeout,dataFactory) {
	$scope.ipvsadmin = [];
	
	var success = function(data){
		$scope.ipvsadmin = data;
    };
	
    function getSysinfo(){
    	dataFactory.getIpvsadm().success(success);
    	$timeout( getSysinfo, 5000);
    }
    
    getSysinfo();
}]);

