'use strict';

// Declare app level module
var myApp = angular
    .module('myApp', ['ngRoute', 'ngTouch'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'templates/listView.html', controller: 'ListCtrl'});
        $routeProvider.when('/review', {templateUrl: 'templates/review.html', controller: 'ListCtrl'});
        $routeProvider.when('/settings', {templateUrl: 'templates/settings.html', controller: 'ListCtrl'});
        $routeProvider.otherwise({redirectTo: '/'})
    }]);
//     .config('indexedDBProvider', function ($indexedDBProvider) {
//         $indexedDBProvider
//             .connection('myIndexedDB')
//             .upgradeDatabase(myVersion, function(event, db, tx){
//                 var objStore = db.createObjectStore('people', {keyPath: 'ssn'});
//                 objStore.createIndex('name_idx', 'name', {unique: false});
//                 objStore.createIndex('age_idx', 'age', {unique: false});
//                 console.log('ready');
//             });
//       });
