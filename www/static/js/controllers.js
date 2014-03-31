'use strict';

myApp.controller('NavController',['$rootScope','$scope', '$location', function($rootScope, $scope, $location){

    
    $rootScope.toggleNav = function(){
        $('.side-nav').toggleClass('left-nav');
    };
    
    $scope.isActive = function(route) {
        console.log(route,$location.path());
        return route === $location.path();
    }
}]);

myApp.controller('ListCtrl',
    ['$rootScope', '$scope', 'cardsService', function ($rootScope, $scope, cardsService) {
        
        $scope.cards = [
            {id: 0, question: "What is?", answer: "an ansswer!"},
            {id: 1, question: "What is it not?", answer: "an question..."},
            {id: 2, question: "Where is it?", answer: "MY HOUSE!"},
            {id: 3, question: "What is?", answer: "an ansswer!"},
            {id: 4, question: "What is it not?", answer: "an question..."},
            {id: 5, question: "Where is it?", answer: "MY HOUSE!"},
            {id: 6, question: "What is?", answer: "an ansswer!"},
            {id: 7, question: "What is it not?", answer: "an question..."},
            {id: 8, question: "Where is it?", answer: "MY HOUSE!"},
            {id: 9, question: "What is?", answer: "an ansswer!"},
            {id: 10, question: "What is it not?", answer: "an question..."},
            {id: 11, question: "Where is it?", answer: "MY HOUSE!"},
            {id: 12, question: "What is?", answer: "an ansswer!"},
            {id: 13, question: "What is it not?", answer: "an question..."},
            {id: 14, question: "Where is it?", answer: "MY HOUSE!"},
        ];
        $scope.getListItemClass = function($index){
            if ($index == 0) return "topcoat-list__item--first";
            return "topcoat-list__item";
        }

        // Todo.readAll().then(function (todos) {
        //     $scope.$apply(function () {
        //         $scope.todos = todos;
        //     });
        // });
}]);




                     