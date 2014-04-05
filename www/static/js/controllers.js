'use strict';

myApp.controller('AppController', ['$rootScope', '$location', 'dbService', 'fileService', 
    function($rootScope, $location, dbService, fileService){        

 
        $rootScope.cards = [];
        $rootScope.getCardPath = function(card){
            return card.path.replace("cdvfile://","");
        }

        $rootScope.refresh_cards_list = function(){
            dbService.getCards().then(function (results) {
                var cards = [];
                for(var i = 0; i < results.rows.length; i++){
                    cards[i] = results.rows.item(i);
                }
                if(results.rows.length) $('.topcoat-spinner').hide();
                $rootScope.cards = cards;

            });
        };
        

        

        dbService.init().then(function(){
            $('.topcoat-spinner').show();
            dbService.getEmptyPhotos().then(function (results) {
                var PhotoHandler = {
                    neededDownloads: results.rows.length,
                    downloadedFiles: 0,
                    downloadErrors: 0,
                    refresh_cards: function(){
                        console.log(PhotoHandler.neededDownloads, PhotoHandler.downloadedFiles, PhotoHandler.downloadErrors);
                        if(PhotoHandler.neededDownloads === (PhotoHandler.downloadedFiles + PhotoHandler.downloadErrors)){
                            $rootScope.refresh_cards_list();
                        }
                    },
                    downloadPhoto: function(photo){
                        console.log("downloadPhoto");
                        fileService.downloadFile(photo.url).then(function(uri, path){
                            console.log(photo.id, photo.url, uri, path);
                            dbService.setPhotoPath(photo.id, path).then(function(){
                                console.log("updated Photo Path");
                                PhotoHandler.downloadedFiles++;
                                PhotoHandler.refresh_cards();
                            });
                        },function(){
                            PhotoHandler.downloadErrors++;
                            PhotoHandler.refresh_cards();
                        });
                    }
                };
                for(var i = 0; i < results.rows.length; i++){
                    var photo = results.rows.item(i);
                    PhotoHandler.downloadPhoto(photo);
                }
            });
        });       

        $rootScope.refresh_cards_list();


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

myApp.controller('ListCtrl',["$rootScope",'$scope', 'dbService',
    function ($scope, dbService) {

        $scope.search = function(query){
            $('.topcoat-navigation-bar__title').hide();
        }

        $scope.getListItemClass = function($index){
            if ($index == 0) return "topcoat-list__item--first";
            return "topcoat-list__item";
        }
    }
]);       