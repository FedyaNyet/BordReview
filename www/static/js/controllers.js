'use strict';

myApp.controller('AppController', ['$rootScope', '$location', 'cardsService', 
    function($rootScope, $location, cardsService){

        cardsService.init().then(function(){
            console.log('loaded db');
        });

        $rootScope.hideNav = function(){
            $('.slide').removeClass('nav-open');
        }
        
        $rootScope.$on('$routeChangeStart', function(next, current) { 
            $rootScope.hideNav();
        });
    }
]);

myApp.controller('NavController',['$rootScope','$scope', '$location', 'cardsService', 
    function($rootScope, $scope, $location, cardsService){
       
        $rootScope.toggleSideNav = function(){
            console.log( $('.side-nav'));
            $('.slide').toggleClass('nav-open');
        };
        $scope.sideNavItemIsActive = function(route) {
            return route === $location.path();
        }
    }
]);

myApp.controller('ListCtrl',['$scope', 'cardsService', 
    function ($scope, cardsService) {
        
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
    }
]);




                     