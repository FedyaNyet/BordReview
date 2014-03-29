'use strict';

myApp.controller('ListCtrl',
    ['$rootScope', '$scope', 'cardsService', function ($rootScope, $scope, cardsService) {
        
        $rootScope.showSettings = false;

        $scope.slidePage = function (path,type) {
            return true;
            // navSvc.slidePage(path,type);
        };
        $scope.back = function () {
            return true;
            // navSvc.back();
        };
        $scope.changeSettings = function () {
            $rootScope.showSettings = true;
        };
        $scope.closeOverlay = function () {
            $rootScope.showSettings = false;
        };
}]);




                     