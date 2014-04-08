'use strict';

myApp.controller('AppController', ['$rootScope', '$location', 'dbService', 'fileService', 
    function($rootScope, $location, dbService, fileService){        

 
        $rootScope.cards = [];

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
                        console.log(PhotoHandler.downloadedFiles + PhotoHandler.downloadErrors + "/" + PhotoHandler.neededDownloads);
                        if(PhotoHandler.neededDownloads === (PhotoHandler.downloadedFiles + PhotoHandler.downloadErrors)){
                            $rootScope.refresh_cards_list();
                        }
                    },
                    downloadPhoto: function(photo){
                        fileService.downloadFile(photo.url).then(function(path){
                            dbService.setPhotoPath(photo.id, path).then(function(){
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
    
        var SoftKeyboard = SoftKeyboard || {hide:function(){console.log('hidding keyboard');},show:function(){console.log('showing keyboard');}};
        $scope.search = {
            query: "",
            active: false,
            do: function(){
                console.log("search"+ $scope.search.query);
            },
            toggle: function(){
                $scope.search.active = !$scope.search.active;
                $scope.search.query = "";
                setTimeout(function() {
                    $('[name=search]')
                        .off('blur focus')
                        .on({
                            focus:function(){
                                SoftKeyboard.show();
                            },
                            blur:function(){
                                SoftKeyboard.hide();
                            }
                        }).focus(); 
                }, 200);
            }
        };

        $scope.getListItemClass = function($index){
            if ($index == 0) return "topcoat-list__item--first";
            return "topcoat-list__item";
        }
    }
]);       