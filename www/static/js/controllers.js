'use strict';

myApp.controller('AppController', ['$rootScope', '$location', 'dbService', 'fileService', 
    function($rootScope, $location, dbService, fileService){        

 
        dbService.init().then(function(){
            var downloadedFiles = 0;
            var neededDownloads = 0;
            var downloadErrors = 0;
            var refresh_cards = function(){
                console.log(neededDownloads, downloadedFiles, downloadErrors);
                if(neededDownloads === (downloadedFiles + downloadErrors)){
                    refresh_cards_list();
                }
            };
            dbService.getEmptyPhotos().then(function (results) {
                neededDownloads = results.rows.length;
                var photo_url_id_map = {};
                for(var i = 0; i < results.rows.length; i++){
                    var photo = results.rows.item(i);
                    photo_url_id_map[photo.url] = photo.id;
                    fileService.downloadFile(photo.url).then(function(path, url){
                        console.log('downloaded: '+ path);
                        photoId = photo_url_id_map[url];
                        console.log(photoId, url, path);
                        dbService.setPhotoPath(photoId, path).then(function(){
                            downloadedFiles++;
                            refresh_cards();
                        });
                    },function(){
                        downloadErrors++;
                        refresh_cards();
                    });
                }
            });
        });       

        $rootScope.cards = [];

        $rootScope.refresh_cards_list = function(){
            console.log('refreshing cards');
            dbService.getCards().then(function (results) {
                var cards = [];
                for(var i = 0; i < results.rows.length; i++){
                    cards[i] = results.rows.item(i);
                }
                $rootScope.cards = cards;
            });
        }
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