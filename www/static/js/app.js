'use strict';

// Declare app level module
var myApp = angular
    .module('myApp', ['ngRoute', 'ngTouch'])
    .config(['$routeProvider' , function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'templates/listView.html', controller: 'ListCtrl'});
        $routeProvider.when('/review', {templateUrl: 'templates/review.html', controller: 'ListCtrl'});
        $routeProvider.when('/settings', {templateUrl: 'templates/settings.html', controller: 'ListCtrl'});
        $routeProvider.otherwise({redirectTo: '/'})
    }])
    .config([ '$compileProvider', function ($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|cdvfile):/);
	}]);