'use strict';

myApp.factory('dbService',['$q',function($q){

    var db;
    var runQueryPromise = function(query, params){
        if(!params){
            params = [];
        } 
        var deferred = $q.defer();
        db.transaction(function(tx) {
            tx.executeSql(query, params,
                function(tx, rs){
                    deferred.resolve(rs); 
                },
                function(tx, error){
                    console.log(error.code + " - " + error.message);
                    deferred.reject(error); 
                }
            );
        }, function(){ 
            //transaction Error
            deferred.reject(); 
        });
        return deferred.promise;
    }

    var isFirstRun = function(){
        return !(window.localStorage.getItem('cards') && window.localStorage.getItem('photoes'));
    }

    return {
        init:function(){
            db = openDatabase('NeuroRad', '1.0', 'NeuroRad', 2 * 1024 * 1024);
            var deferred = $q.defer();
            if(isFirstRun()){
                if(!window.localStorage.getItem('card')){
                    runQueryPromise('CREATE TABLE IF NOT EXISTS `card` (`id` int(11) NOT NULL, `question` varchar(255), `answer` varchar(255), `status` int(2), PRIMARY KEY (`id`));').then(
                        function(){
                            window.localStorage.setItem('cards','created');
                            for(var idx in fixture.cards){
                                var card = fixture.cards[idx];
                                runQueryPromise('INSERT INTO `card` (`id`, `question`, `answer`, `status`) VALUES (?,?,?,?);',[card.id, card.question, card.answer, card.status]);
                            }
                            if(!isFirstRun()){
                                //both tables have been made
                                deferred.resolve();
                            }
                        },
                        function(){
                            deferred.reject(); 
                        }
                    );
                }
                if(!window.localStorage.getItem('photoes')){
                    runQueryPromise('CREATE TABLE IF NOT EXISTS `photo` (`id` int(11) NOT NULL, `mini` varchar(100), `url` varchar(100), `path` varchar(50), `position` int(5),`card_id` int(11) NOT NULL, PRIMARY KEY (`id`));').then(
                        function(){
                            window.localStorage.setItem('photoes','created');
                            for(var idx in fixture.photos){
                                var photo = fixture.photos[idx];
                                runQueryPromise('INSERT INTO `photo` (`id`, `mini`, `url`, `path`, `position`, `card_id`) VALUES (?,?,?,?,?,?);',[photo.id, photo.mini, photo.url, photo.path, photo.position, photo.card_id]);
                            }
                            if(!isFirstRun()){
                                //both tables have been made
                                deferred.resolve();
                            }
                        },
                        function(){
                            deferred.reject(); 
                        }
                    );
                }
            }else{
                deferred.resolve();
            }
            return deferred.promise;
        },
        getCards:function(query){
            var filter = "";
            var params = [];
            if (query){
                filter = " AND ((answer LIKE ?) OR (question LIKE ?)) ";
                params = ["%"+query+"%","%"+query+"%"];
            }
            return runQueryPromise( "SELECT c.id, answer, p.url, p.path, p.mini FROM `card` as c JOIN `photo` as p on p.card_id = c.id WHERE p.position = 0 "+ filter +" ORDER BY c.id", params);
        },
        getEmptyPhotos: function(){
            return runQueryPromise("SELECT * FROM `photo` WHERE path=\"\" ORDER BY card_id",[]);
        },
        setPhotoPath: function(id, path){
            return runQueryPromise("UPDATE `photo` SET path=? where id=?",[path, id]);
        }
    };
}])

var fixture = {
    cards:[
        {   id: 1, 
            question:'Patient with long standing seizures', 
            answer:'Large Cavernous Malformation', 
            status: 0
        },
        {   id: 2, 
            question:'Patient is status post MVC with severe pain',  
            answer:'Chance Fracture',   
            status: 0
        },
        {   id: 3, 
            question:'Patient with progressive bilateral leg weakness and down beating nystagmus',  
            answer:'Clival Meningioma',     
            status: 0
        },
        {   id: 4, 
            question:'Teenager with progressive spastic paraparasis',  
            answer:'Diastamatomyelia of lower thoracic spinal cord',    
            status: 0},
        {   id: 5, 
            question:'Patient with severe low back pain',  
            answer:'Disc space infection and vertebral osteomyelitis',  
            status: 0
        },
        {   id: 6, 
            question:'Left sided Deafness',  
            answer:'Left external auditory canal atresia',  
            status: 0
        },
        {   id: 7, 
            question:'Severe low back pain and radiculopathy',  
            answer:'Extruded L4/5 herniated disc with inferior migration and synovial cyst',
            status: 0
        },
        {   id: 8, 
            question:'Patient status post MVC rollover with severe neck pain.',  
            answer:'Hyperflextion injury with unilateral jumped facet.',
            status: 0
        },
        {   id: 9, 
            question:'Right sided proptosis with double vision',  
            answer:'Orbital Hemangioma',    
            status: 0
        },
        {   id: 10, 
            question:'56 year old female with pelvic pain',  
            answer:'Incidental Lithopedion',
            status: 0
        },
        {   id: 11, 
            question:'Patient is status post MVC with severe pain',  
            answer:'Modic type III degenerative endplate signal changes',
            status: 0
        },
        {   id: 12, 
            question:'50 year old female with history of myelopathy',  
            answer:'Cervical spinal cord myelomalacia',     
            status: 0
        },
        {   id: 13, 
            question:'25 year old male status post MVC with neurologic symptoms',
            answer:'Traumatic cervical nerve root avulsion with pseudomeningocele',     
            status: 0
        },
        {   id: 14, 
            question:'55 year old male with neck pain and neurologic symptoms worse in flexion.',
            answer:'Old type II odontoid fracture with atlanto-axial subluxation',  
            status: 0
        },
        {   id: 15, 
            question:'20 year old with loss of vision in right eye.  History of spinal cord lesion.',  
            answer:'Right Optic Nerve Glioma',  
            status: 0
        },
        {   id: 16, 
            question:'35 year old male status post assault',  
            answer:'Right Orbital Floor fracture with herniation of orbital fat and tethering of inferior rectus muscle.',
            status: 0
        },
        {   id: 17, 
            question:   '10 year old with developmental delay',
            answer:     'Periventricular leukomalacia  with history of pre term delivery',  
            status: 0
        },
        {   id: 18, 
            question:   '35 year old vegetarian with loss of vibratory and positional sense.',
            answer:     'Subacute combined degeneration from pernicious anemia',    
            status: 0
        },
        {   id: 19, 
            question:   '15 year old male with inability  of upward gaze',
            answer:     'Pineal Region Teratoma',   
            status: 0
        },
        {   id: 20, 
            question:   '40 year old with sudden excruciating pain during cerebral angiography.',
            answer:     'Active rupture of posterior communicating artery aneurysm during angiography',     
            status: 0
        },
        {   id: 21, 
            question:   '75 year old female with ground level fall and severe low back/sacral pain',
            answer:     'Sacral Insufficiency fractures',   
            status: 0
        },
        {   id: 22, 
            question:   '85 year old male with severe back pain.  History of spinal procedure 40 years ago.',
            answer:     'Retained Pantopaque from remote myelogram',    
            status: 0
        },
        {   id: 23, 
            question:   '3 week old with tuft of hair and sacral dimple',
            answer:     'Tethering of spinal cord with large intradural lipoma',    
            status: 0
        },
        {   id: 24, 
            question:   '50 year old with history of previous CVA ',
            answer:     'Persistent Trigeminal Artery',     
            status: 0
        },
    ],

    photos:[
        {id: 1,     mini:"/static/img/mini/2-10.png",    url:"http://fyodorwolf.com/BordReview/cases/2-10.jpg",     path: "",   position:0, card_id: 10},
        {id: 2,     mini:"/static/img/mini/2-11a.png",   url:"http://fyodorwolf.com/BordReview/cases/2-11a.jpg",    path: "",   position:0, card_id: 11},
        {id: 3,     mini:"/static/img/mini/2-11b.png",   url:"http://fyodorwolf.com/BordReview/cases/2-11b.jpg",    path: "",   position:1, card_id: 11},
        {id: 4,     mini:"/static/img/mini/2-12.png",    url:"http://fyodorwolf.com/BordReview/cases/2-12.jpg",     path: "",   position:0, card_id: 12},
        {id: 5,     mini:"/static/img/mini/2-13.png",    url:"http://fyodorwolf.com/BordReview/cases/2-13.jpg",     path: "",   position:0, card_id: 13},
        {id: 6,     mini:"/static/img/mini/2-14a.png",   url:"http://fyodorwolf.com/BordReview/cases/2-14a.jpg",    path: "",   position:0, card_id: 14},
        {id: 7,     mini:"/static/img/mini/2-14b.png",   url:"http://fyodorwolf.com/BordReview/cases/2-14b.jpg",    path: "",   position:1, card_id: 14},
        {id: 8,     mini:"/static/img/mini/2-15.png",    url:"http://fyodorwolf.com/BordReview/cases/2-15.jpg",     path: "",   position:0, card_id: 15},
        {id: 9,     mini:"/static/img/mini/2-16.png",    url:"http://fyodorwolf.com/BordReview/cases/2-16.jpg",     path: "",   position:0, card_id: 16},
        {id: 10,    mini:"/static/img/mini/2-17.png",    url:"http://fyodorwolf.com/BordReview/cases/2-17.jpg",     path: "",   position:0, card_id: 17},
        {id: 11,    mini:"/static/img/mini/2-18a.png",   url:"http://fyodorwolf.com/BordReview/cases/2-18a.jpg",    path: "",   position:0, card_id: 18},
        {id: 12,    mini:"/static/img/mini/2-18b.png",   url:"http://fyodorwolf.com/BordReview/cases/2-18b.jpg",    path: "",   position:1, card_id: 18},
        {id: 13,    mini:"/static/img/mini/2-19.png",    url:"http://fyodorwolf.com/BordReview/cases/2-19.jpg",     path: "",   position:0, card_id: 19},
        {id: 14,    mini:"/static/img/mini/2-1a.png",    url:"http://fyodorwolf.com/BordReview/cases/2-1a.jpg",     path: "",   position:0, card_id: 1},
        {id: 15,    mini:"/static/img/mini/2-1b.png",    url:"http://fyodorwolf.com/BordReview/cases/2-1b.jpg",     path: "",   position:1, card_id: 1},
        {id: 16,    mini:"/static/img/mini/2-20a.png",   url:"http://fyodorwolf.com/BordReview/cases/2-20a.jpg",    path: "",   position:0, card_id: 20},
        {id: 17,    mini:"/static/img/mini/2-20b.png",   url:"http://fyodorwolf.com/BordReview/cases/2-20b.jpg",    path: "",   position:1, card_id: 20},
        {id: 18,    mini:"/static/img/mini/2-21a.png",   url:"http://fyodorwolf.com/BordReview/cases/2-21a.jpg",    path: "",   position:0, card_id: 21},
        {id: 19,    mini:"/static/img/mini/2-21b.png",   url:"http://fyodorwolf.com/BordReview/cases/2-21b.jpg",    path: "",   position:1, card_id: 21},
        {id: 20,    mini:"/static/img/mini/2-21c.png",   url:"http://fyodorwolf.com/BordReview/cases/2-21c.jpg",    path: "",   position:2, card_id: 21},
        {id: 21,    mini:"/static/img/mini/2-22a.png",   url:"http://fyodorwolf.com/BordReview/cases/2-22a.jpg",    path: "",   position:0, card_id: 22},
        {id: 22,    mini:"/static/img/mini/2-22b.png",   url:"http://fyodorwolf.com/BordReview/cases/2-22b.jpg",    path: "",   position:1, card_id: 22},
        {id: 23,    mini:"/static/img/mini/2-23.png",    url:"http://fyodorwolf.com/BordReview/cases/2-23.jpg",     path: "",   position:0, card_id: 23},
        {id: 24,    mini:"/static/img/mini/2-24a.png",   url:"http://fyodorwolf.com/BordReview/cases/2-24a.jpg",    path: "",   position:0, card_id: 24},
        {id: 25,    mini:"/static/img/mini/2-24b.png",   url:"http://fyodorwolf.com/BordReview/cases/2-24b.jpg",    path: "",   position:1, card_id: 24},
        {id: 26,    mini:"/static/img/mini/2-24c.png",   url:"http://fyodorwolf.com/BordReview/cases/2-24c.jpg",    path: "",   position:2, card_id: 24},
        {id: 27,    mini:"/static/img/mini/2-24d.png",   url:"http://fyodorwolf.com/BordReview/cases/2-24d.jpg",    path: "",   position:3, card_id: 24},
        {id: 28,    mini:"/static/img/mini/2-24e.png",   url:"http://fyodorwolf.com/BordReview/cases/2-24e.jpg",    path: "",   position:4, card_id: 24},
        {id: 29,    mini:"/static/img/mini/2-2a.png",    url:"http://fyodorwolf.com/BordReview/cases/2-2a.jpg",     path: "",   position:0, card_id: 2},
        {id: 30,    mini:"/static/img/mini/2-2b.png",    url:"http://fyodorwolf.com/BordReview/cases/2-2b.jpg",     path: "",   position:1, card_id: 2},
        {id: 31,    mini:"/static/img/mini/2-2c.png",    url:"http://fyodorwolf.com/BordReview/cases/2-2c.jpg",     path: "",   position:2, card_id: 2},
        {id: 32,    mini:"/static/img/mini/2-3.png",     url:"http://fyodorwolf.com/BordReview/cases/2-3.jpg",      path: "",   position:0, card_id: 3},
        {id: 33,    mini:"/static/img/mini/2-4.png",     url:"http://fyodorwolf.com/BordReview/cases/2-4.jpg",      path: "",   position:0, card_id: 4},
        {id: 34,    mini:"/static/img/mini/2-5a.png",    url:"http://fyodorwolf.com/BordReview/cases/2-5a.jpg",     path: "",   position:0, card_id: 5},
        {id: 35,    mini:"/static/img/mini/2-5b.png",    url:"http://fyodorwolf.com/BordReview/cases/2-5b.jpg",     path: "",   position:1, card_id: 5},
        {id: 36,    mini:"/static/img/mini/2-5c.png",    url:"http://fyodorwolf.com/BordReview/cases/2-5c.jpg",     path: "",   position:2, card_id: 5},
        {id: 37,    mini:"/static/img/mini/2-6a.png",    url:"http://fyodorwolf.com/BordReview/cases/2-6a.jpg",     path: "",   position:0, card_id: 6},
        {id: 38,    mini:"/static/img/mini/2-6b.png",    url:"http://fyodorwolf.com/BordReview/cases/2-6b.jpg",     path: "",   position:1, card_id: 6},
        {id: 39,    mini:"/static/img/mini/2-6c.png",    url:"http://fyodorwolf.com/BordReview/cases/2-6c.jpg",     path: "",   position:2, card_id: 6},
        {id: 40,    mini:"/static/img/mini/2-6d.png",    url:"http://fyodorwolf.com/BordReview/cases/2-6d.jpg",     path: "",   position:3, card_id: 6},
        {id: 41,    mini:"/static/img/mini/2-7a.png",    url:"http://fyodorwolf.com/BordReview/cases/2-7a.jpg",     path: "",   position:0, card_id: 7},
        {id: 42,    mini:"/static/img/mini/2-7b.png",    url:"http://fyodorwolf.com/BordReview/cases/2-7b.jpg",     path: "",   position:1, card_id: 7},
        {id: 43,    mini:"/static/img/mini/2-7c.png",    url:"http://fyodorwolf.com/BordReview/cases/2-7c.jpg",     path: "",   position:2, card_id: 7},
        {id: 44,    mini:"/static/img/mini/2-7d.png",    url:"http://fyodorwolf.com/BordReview/cases/2-7d.jpg",     path: "",   position:3, card_id: 7},
        {id: 45,    mini:"/static/img/mini/2-8a.png",    url:"http://fyodorwolf.com/BordReview/cases/2-8a.jpg",     path: "",   position:0, card_id: 8},
        {id: 46,    mini:"/static/img/mini/2-8b.png",    url:"http://fyodorwolf.com/BordReview/cases/2-8b.jpg",     path: "",   position:1, card_id: 8},
        {id: 47,    mini:"/static/img/mini/2-9a.png",    url:"http://fyodorwolf.com/BordReview/cases/2-9a.jpg",     path: "",   position:0, card_id: 9},
        {id: 48,    mini:"/static/img/mini/2-9b.png",    url:"http://fyodorwolf.com/BordReview/cases/2-9b.jpg",     path: "",   position:1, card_id: 9},
        {id: 49,    mini:"/static/img/mini/2-9c.png",    url:"http://fyodorwolf.com/BordReview/cases/2-9c.jpg",     path: "",   position:2, card_id: 9}
    ]
};