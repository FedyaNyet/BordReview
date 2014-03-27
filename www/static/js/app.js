'use strict';

function jsonp_callback(data) {
    // returning from async callbacks is (generally) meaningless
    console.log(data.found);
}


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['ngRoute', 'ngTouch', 'myApp.filters', 'myApp.services', 'myApp.directives'])
    // .config(function ($compileProvider){
    //     $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|filterse|tel):/);
    //     console.log('here');
    // })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'templates/homeView.html', controller: 'HomeCtrl'});
        // $routeProvider.when('/view1', {templateUrl: 'templates/notificationView.html'});
        // $routeProvider.when('/view2', {templateUrl: 'templates/geolocationView.html'});
        // $routeProvider.when('/view3', {templateUrl: 'templates/accelerometerView.html'});
        // $routeProvider.when('/view4', {templateUrl: 'templates/deviceInfoView.html'});
        // $routeProvider.when('/view5', {templateUrl: 'templates/cameraView.html'});
        // $routeProvider.when('/view6', {templateUrl: 'templates/contactsView.html'});
        // $routeProvider.when('/view7', {templateUrl: 'templates/compassView.html'});
        // $routeProvider.when('/view8', {templateUrl: 'templates/hackerNewsView.html'});
        $routeProvider.otherwise({redirectTo: '/'});
  }]);
