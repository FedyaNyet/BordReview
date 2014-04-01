'use strict';

myApp.factory('cardsService',['$q',function($q){

	var db;
	var fixture = {
		1: {question:'My name is what?', 			answer:'Slim Shady', 	status: 1},
		2: {question:'Is there anybody in there?',  answer:'no, nobody.', 	status: 0}
	}

	return {
		init:function(){
			db = openDatabase('NeuroRad', '1.0', 'NeuroRad', 2 * 1024 * 1024);
			if(!localStorage.getItem('created')){
				db.transaction(function (tx) {
					var queries = [
						"CREATE TABLE `card` (`id` int(11) NOT NULL, `question` varchar(255), `answer` varchar(255), `status` int(2), PRIMARY KEY (`id`))",
						"CREATE TABLE `photo` (`id` int(11) NOT NULL,`path` varchar(50), `position` int(5),`card_id` int(11) NOT NULL, PRIMARY KEY (`id`))"
					];
					for(var id in fixture){
						var card = fixture[id];
						queries.push("INSERT INTO `card` (`id`, `question`, `answer`, `status`) VALUES ("+ id + ",\"" + card.question +"\",\""+ card.answer + "\","+ card.status +")");
					}
					for(var idx in queries){
						var query = queries[idx];
						console.log(query);
						tx.executeSql(query);
					}
					localStorage.setItem('created','true');
				});
			}
		},
		readAll:function(){
			var deferred = $q.defer();
            db.transaction(function(tx) {
            	tx.executeSql("SELECT * FROM `card`",[],function(tx, rs){
                    deferred.resolve(rs); 
            	},function(){
                	console.log('ere');
                    deferred.reject("Error, please re-run the application!"); 
                });
            });
            return deferred.promise;
	    },
	};
}])