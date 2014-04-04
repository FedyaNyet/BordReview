'use strict';

console.log('controllers.js');
myApp.controller('AppController', ['$rootScope', '$location', 'dbService', 'fileService', 
    function($rootScope, $location, dbService, fileService){        

        dbService.init().then(function(){
            dbService.getEmptyPhotos().then(function (results) {
                for(var i = 0; i< results.rows.length){
                    var photo = results.rows.item(i);
                    fileService.downloadFile(photo.url).then(function(path){
                        dbService.setPhotoPath(photo.id, path);
                    });
                }
            });
        });

        $rootScope.$on('$locationChangeStart', function(event, next, current) { 
            $rootScope.hideNav();
        });
    }
]);

myApp.controller('NavController',['$rootScope','$scope', '$location', 
    function($rootScope, $scope, $location){

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

myApp.controller('ListCtrl',['$scope', 'dbService',
    function ($scope, dbService) {
        
        $scope.cards = [];
        dbService.getCards().then(function (results) {
            $scope.cards = [];
            for(var i = 0; i < results.rows.length; i++){
                var card = results.rows.item(i);
                $scope.cards.push(card);
            }
        });

        $scope.search = function(query){
            $('.topcoat-navigation-bar__title').hide();
        }

        $scope.getListItemClass = function($index){
            if ($index == 0) return "topcoat-list__item--first";
            return "topcoat-list__item";
        }
    }
]);       