'use strict';

myApp.factory('cardsService',['$q',function($q){

	var db;
	var fixture = {
		1: {question:'My name is what?', 			answer:'Slim Shady', 	status: 1},
		2: {question:'Is there anybody in there?',  answer:'no, nobody.', 	status: 0}
	}

	return {
		init:function(){
			var deferred = $q.defer();
			db = openDatabase('NeuroRad', '1.0', 'NeuroRad', 2 * 1024 * 1024);
			if(!window.localStorage.getItem('created')){

				db.transaction(function (tx) {
					var query =
						"CREATE TABLE `card` (`id` int(11) NOT NULL, `question` varchar(255), `answer` varchar(255), `status` int(2), PRIMARY KEY (`id`)); "+
						"CREATE TABLE `photo` (`id` int(11) NOT NULL,`path` varchar(50), `position` int(5),`card_id` int(11) NOT NULL, PRIMARY KEY (`id`)); "
					for(var id in fixture){
						var card = fixture[id];
						query += "INSERT INTO `card` (`id`, `question`, `answer`, `status`) VALUES ("+ id + ",\"" + card.question +"\",\""+ card.answer + "\","+ card.status +"); ";
					}
					tx.executeSql(query, [], 
						function(){
							window.localStorage.setItem('created','true');
							deferred.resolve();
						}, 
						function(tx, error){
							console.log("cardsService.init() ERROR: "+ error.message);
							deferred.reject();
						}
					);
				});
			}else{
				deferred.resolve();
			}
            return deferred.promise;
		},
		readAll:function(){
			var deferred = $q.defer();
            db.transaction(function(tx) {
            	tx.executeSql("SELECT * FROM `card`",[],
	        		function(tx, rs){
	                    deferred.resolve(rs); 
	            	},
	            	function(tx, error){
						console.log("cardsService.readAll() Error: "+ error.message);
	                    deferred.reject(); 
	                }
                );
            });
            return deferred.promise;
	    },
	};
}])