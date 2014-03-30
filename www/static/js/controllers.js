'use strict';

myApp.controller('ListCtrl',
    ['$rootScope', '$scope', 'cardsService', function ($rootScope, $scope, cardsService) {
        
        $scope.cards = [
            {id: 0, question: "What is?", answer: "an ansswer!"},
            {id: 1, question: "What is it not?", answer: "an question..."},
            {id: 2, question: "Where is it?", answer: "MY HOUSE!"}
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




                     