'use strict';

myApp.controller('NavController',['$rootScope','$scope', '$location', 'cardsService', function($rootScope, $scope, $location, cardsService){

    // window.plugins.spinnerDialog.show();
    cardsService.init().then(function(){
        // window.plugins.spinnerDialog.hide();
        console.log('loaded db');
    });

    $rootScope.$on('$routeChangeStart', function(next, current) { 
        $rootScope.toggleNav();
    });

    $rootScope.toggleNav = function(){
        $('.side-nav').toggleClass('left-nav');
    };
    $scope.isActive = function(route) {
        return route === $location.path();
    }
}]);

myApp.controller('ListCtrl',
    ['$scope', 'cardsService', function ($scope, cardsService) {
        
        $scope.cards = [];
        cardsService.readAll().then(function (results) {
            $scope.cards = [];
            for(var i = 0; i < results.rows.length; i++){
                $scope.cards.push(results.rows.item(i));
            }
        });

        $scope.getListItemClass = function($index){
            if ($index == 0) return "topcoat-list__item--first";
            return "topcoat-list__item";
        }
}]);




                     