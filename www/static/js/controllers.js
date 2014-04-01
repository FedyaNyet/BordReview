'use strict';

myApp.controller('AppController', ['$rootScope', '$location', 'cardsService', 
    function($rootScope, $location, cardsService){

        cardsService.init().then(function(){
            console.log('loaded db');
        });

        $rootScope.$on('$locationChangeStart', function(event, next, current) { 
            console.log(current, ' -> ',next);
            $rootScope.hideNav();
        });
    }
]);

myApp.controller('NavController',['$rootScope','$scope', '$location', 'cardsService', 
    function($rootScope, $scope, $location, cardsService){

        $rootScope.toggleSideNav = function(){
            $('.slide').toggleClass('nav-open');
        };

        $rootScope.hideNav = function(event){
            $('.slide').removeClass('nav-open');
        };

        $scope.sideNaveItemClick = function(event){
            var href = event.target.href;
            href = href.slice(href.indexOf('#')+1)
            if(href === $location.path()){
                $rootScope.hideNav(); //locationChangeStart won't be fired...
            }
            $location.path(href);
        };

        $scope.sideNavItemIsActive = function(route) {
            return route === $location.path();
        };
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

        $scope.search = function(query){
            alert(query);
        }

        $scope.getListItemClass = function($index){
            if ($index == 0) return "topcoat-list__item--first";
            return "topcoat-list__item";
        }
    }
]);       