'use strict';

myApp.factory('cardsService',['$q',function($q){

	var db;
	return {
		init:function(){
			var deferred = $q.defer();
			db = openDatabase('NeuroRad', '1.0', 'NeuroRad', 2 * 1024 * 1024);
			if(!window.localStorage.getItem('cards') || !window.localStorage.getItem('photoes')){
				db.transaction(function (tx) {
					if(!window.localStorage.getItem('cards'))
						tx.executeSql('CREATE TABLE `card` (`id` int(11) NOT NULL, `question` varchar(255), `answer` varchar(255), `status` int(2), PRIMARY KEY (`id`));',[], 
							function(){
								window.localStorage.setItem('cards','created');
								for(var idx in fixture.cards){
									var card = fixture.cards[idx];
									tx.executeSql('INSERT INTO `card` (`id`, `question`, `answer`, `status`) VALUES (?,?,?,?);',[card.id, card.question, card.answer, card.status]);
								}
							},
							function(tx, error){
								console.log(error.code, error.message);
							}
						);
					if(!window.localStorage.getItem('photoes'))
						tx.executeSql('CREATE TABLE `photo` (`id` int(11) NOT NULL,`path` varchar(50), `position` int(5),`card_id` int(11) NOT NULL, PRIMARY KEY (`id`));',[], 
							function(){
								window.localStorage.setItem('photoes','created');
								for(var idx in fixture.photos){
									var photo = fixture.photos[idx];
									tx.executeSql('INSERT INTO `photo` (`id`, `path`, `position`, `card_id`) VALUES (?,?,?,?);',[photo.id, photo.path, photo.position, photo.card_id]);
								}
							},
							function(tx, error){
								console.log(error.code, error.message);
							}
						);
				}, function(){ //transaction Error
                    deferred.reject(); 
				}, function(){
    				deferred.resolve(); 
				});
			}else{
				deferred.resolve();
			}
            return deferred.promise;
		},
		readAll:function(){
			var deferred = $q.defer();
            db.transaction(function(tx) {
            	tx.executeSql("SELECT c.id, answer, p.path FROM `card` as c JOIN `photo` as p on p.card_id = c.id where p.position = 0 ORDER BY c.id",[],
	        		function(tx, rs){
	                    deferred.resolve(rs); 
	            	},
	            	function(tx, error){
						console.log("cardsService.readAll() Error code:"+ error.code + " - " + error.message);
	                    deferred.reject(); 
	                }
                );
            });
            return deferred.promise;
	    },
	};
}])

var fixture = {
	cards:[
		{	id: 1, 
			question:'Patient with long standing seizures', 
			answer:'Large Cavernous Malformation', 
			status: 0
		},
		{	id: 2, 
			question:'Patient is status post MVC with severe pain',  
			answer:'Chance Fracture', 	
			status: 0
		},
		{	id: 3, 
			question:'Patient with progressive bilateral leg weakness and down beating nystagmus',  
			answer:'Clival Meningioma', 	
			status: 0
		},
		{	id: 4, 
			question:'Teenager with progressive spastic paraparasis',  
			answer:'Diastamatomyelia of lower thoracic spinal cord', 	
			status: 0},
		{	id: 5, 
			question:'Patient with severe low back pain',  
			answer:'Disc space infection and vertebral osteomyelitis', 	
			status: 0
		},
		{	id: 6, 
			question:'Left sided Deafness',  
			answer:'Left external auditory canal atresia', 	
			status: 0
		},
		{	id: 7, 
			question:'Severe low back pain and radiculopathy',  
			answer:'Extruded L4/5 herniated disc with inferior migration and synovial cyst',
			status: 0
		},
		{	id: 8, 
			question:'Patient status post MVC rollover with severe neck pain.',  
			answer:'Hyperflextion injury with unilateral jumped facet.',
			status: 0
		},
		{	id: 9, 
			question:'Right sided proptosis with double vision',  
			answer:'Orbital Hemangioma', 	
			status: 0
		},
		{	id: 10, 
			question:'56 year old female with pelvic pain',  
			answer:'Incidental Lithopedion',
			status: 0
		},
		{	id: 11, 
			question:'Patient is status post MVC with severe pain',  
			answer:'Modic type III degenerative endplate signal changes',
			status: 0
		},
		{	id: 12, 
			question:'50 year old female with history of myelopathy',  
			answer:'Cervical spinal cord myelomalacia', 	
			status: 0
		},
		{	id: 13, 
			question:'25 year old male status post MVC with neurologic symptoms',
		  	answer:'Traumatic cervical nerve root avulsion with pseudomeningocele', 	
		  	status: 0
		},
		{	id: 14, 
			question:'55 year old male with neck pain and neurologic symptoms worse in flexion.',
		 	answer:'Old type II odontoid fracture with atlanto-axial subluxation', 	
		 	status: 0
	 	},
		{	id: 15, 
			question:'20 year old with loss of vision in right eye.  History of spinal cord lesion.',  
			answer:'Right Optic Nerve Glioma', 	
			status: 0
		},
		{	id: 16, 
			question:'35 year old male status post assault',  
			answer:'Right Orbital Floor fracture with herniation of orbital fat and tethering of inferior rectus muscle.',
			status: 0
		},
		{	id: 17, 
			question: 	'10 year old with developmental delay',
			answer: 	'Periventricular leukomalacia  with history of pre term delivery', 	
			status: 0
		},
		{	id: 18, 
			question: 	'35 year old vegetarian with loss of vibratory and positional sense.',
			answer: 	'Subacute combined degeneration from pernicious anemia', 	
			status: 0
		},
		{	id: 19, 
			question: 	'15 year old male with inability  of upward gaze',
			answer: 	'Pineal Region Teratoma', 	
			status: 0
		},
		{	id: 20, 
			question: 	'40 year old with sudden excruciating pain during cerebral angiography.',
			answer: 	'Active rupture of posterior communicating artery aneurysm during angiography', 	
			status: 0
		},
		{	id: 21, 
			question: 	'75 year old female with ground level fall and severe low back/sacral pain',
			answer: 	'Sacral Insufficiency fractures', 	
			status: 0
		},
		{	id: 22, 
			question: 	'85 year old male with severe back pain.  History of spinal procedure 40 years ago.',
			answer: 	'Retained Pantopaque from remote myelogram', 	
			status: 0
		},
		{	id: 23, 
			question: 	'3 week old with tuft of hair and sacral dimple',
			answer: 	'Tethering of spinal cord with large intradural lipoma', 	
			status: 0
		},
		{	id: 24, 
			question: 	'50 year old with history of previous CVA ',
			answer: 	'Persistent Trigeminal Artery', 	
			status: 0
		},
	],
	photos:[
		{id: 1, 	path: "/static/img/cases/2-10.jpg", 	position:0, card_id: 10},
		{id: 2, 	path: "/static/img/cases/2-11a.jpg", 	position:0, card_id: 11},
		{id: 3, 	path: "/static/img/cases/2-11b.jpg", 	position:1, card_id: 11},
		{id: 4, 	path: "/static/img/cases/2-12.jpg", 	position:0, card_id: 12},
		{id: 5, 	path: "/static/img/cases/2-13.jpg", 	position:0, card_id: 13},
		{id: 6, 	path: "/static/img/cases/2-14a.jpg", 	position:0, card_id: 14},
		{id: 7, 	path: "/static/img/cases/2-14b.jpg", 	position:1, card_id: 14},
		{id: 8, 	path: "/static/img/cases/2-15.jpg", 	position:0, card_id: 15},
		{id: 9, 	path: "/static/img/cases/2-16.jpg", 	position:0, card_id: 16},
		{id: 10, 	path: "/static/img/cases/2-17.jpg", 	position:0, card_id: 17},
		{id: 11, 	path: "/static/img/cases/2-18a.jpg", 	position:0, card_id: 18},
		{id: 12, 	path: "/static/img/cases/2-18b.jpg", 	position:1, card_id: 18},
		{id: 13, 	path: "/static/img/cases/2-19.jpg", 	position:0, card_id: 19},
		{id: 14, 	path: "/static/img/cases/2-1a.jpg", 	position:0, card_id: 1},
		{id: 15, 	path: "/static/img/cases/2-1b.jpg", 	position:1, card_id: 1},
		{id: 16, 	path: "/static/img/cases/2-20a.jpg", 	position:0, card_id: 20},
		{id: 17, 	path: "/static/img/cases/2-20b.jpg", 	position:1, card_id: 20},
		{id: 18, 	path: "/static/img/cases/2-21a.jpg", 	position:0, card_id: 21},
		{id: 19, 	path: "/static/img/cases/2-21b.jpg", 	position:1, card_id: 21},
		{id: 20, 	path: "/static/img/cases/2-21c.jpg", 	position:2, card_id: 21},
		{id: 21, 	path: "/static/img/cases/2-22a.jpg", 	position:0, card_id: 22},
		{id: 22, 	path: "/static/img/cases/2-22b.jpg", 	position:1, card_id: 22},
		{id: 23, 	path: "/static/img/cases/2-23.jpg", 	position:0, card_id: 23},
		{id: 24, 	path: "/static/img/cases/2-24a.jpg", 	position:0, card_id: 24},
		{id: 25, 	path: "/static/img/cases/2-24b.jpg", 	position:1, card_id: 24},
		{id: 26, 	path: "/static/img/cases/2-24c.jpg", 	position:2, card_id: 24},
		{id: 27, 	path: "/static/img/cases/2-24d.jpg", 	position:3, card_id: 24},
		{id: 28, 	path: "/static/img/cases/2-24e.jpg", 	position:4, card_id: 24},
		{id: 29, 	path: "/static/img/cases/2-2a.jpg", 	position:0, card_id: 2},
		{id: 30, 	path: "/static/img/cases/2-2b.jpg", 	position:1, card_id: 2},
		{id: 31, 	path: "/static/img/cases/2-2c.jpg", 	position:2, card_id: 2},
		{id: 32, 	path: "/static/img/cases/2-3.jpg", 		position:0, card_id: 3},
		{id: 33, 	path: "/static/img/cases/2-4.jpg", 		position:0, card_id: 4},
		{id: 34, 	path: "/static/img/cases/2-5a.jpg", 	position:0, card_id: 5},
		{id: 35, 	path: "/static/img/cases/2-5b.jpg", 	position:1, card_id: 5},
		{id: 36, 	path: "/static/img/cases/2-5c.jpg", 	position:2, card_id: 5},
		{id: 37, 	path: "/static/img/cases/2-6a.jpg", 	position:0, card_id: 6},
		{id: 38, 	path: "/static/img/cases/2-6b.jpg", 	position:1, card_id: 6},
		{id: 39, 	path: "/static/img/cases/2-6c.jpg", 	position:2, card_id: 6},
		{id: 40, 	path: "/static/img/cases/2-6d.jpg", 	position:3, card_id: 6},
		{id: 41, 	path: "/static/img/cases/2-7a.jpg", 	position:0, card_id: 7},
		{id: 42, 	path: "/static/img/cases/2-7b.jpg", 	position:1, card_id: 7},
		{id: 43, 	path: "/static/img/cases/2-7c.jpg", 	position:2, card_id: 7},
		{id: 44, 	path: "/static/img/cases/2-7d.jpg", 	position:3, card_id: 7},
		{id: 45, 	path: "/static/img/cases/2-8a.jpg", 	position:0, card_id: 8},
		{id: 46, 	path: "/static/img/cases/2-8b.jpg", 	position:1, card_id: 8},
		{id: 47, 	path: "/static/img/cases/2-9a.jpg", 	position:0, card_id: 9},
		{id: 48, 	path: "/static/img/cases/2-9b.jpg", 	position:1, card_id: 9},
		{id: 49, 	path: "/static/img/cases/2-9c.jpg", 	position:2, card_id: 9}
	]
};