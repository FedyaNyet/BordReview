myApp.factory('fileService',['$q',function($q){
    
    var storageLimitMB = 50
    var fileSystem;

    var getFileSystem = function(callback){
        if (fileSystem){
            return callback(fileSystem);
        } 
        var gotStorage = function(grantedBytes, callback){
            window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(fs){
                fileSystem = fs;
                callback(fileSystem);
            }, function(e){console.log(e);});
        }


        if(navigator.webkitTemporaryStorage.requestQuota){
            requested = true;
            navigator.webkitTemporaryStorage.requestQuota(
                storageLimitMB*1024*1024,
                function(size){ console.log('got Chrome storage quota:'+size); gotStorage(size, callback); }, 
                function(e) { console.log('Error', e); }
            );
        }else{
            gotStorage(storageLimitMB*1024*1024, callback);
        }     
    }

    
     


	return {
		checkFileNeedsDownload: function(path){
            var deferred = $q.defer();
            if(path == ""){
                deferred.resolve();  
                return deferred.promise;
            }
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                if(evt.target.result != null){
                    deferred.reject();  
                }        
            };
            reader.readAsDataURL(path);
            return deferred.promise;
		},
		downloadFile: function(url){
			var filename = url.substr(url.lastIndexOf("/")+1);
    		var deferred = $q.defer();
            getFileSystem(function(fileSystem){
                fileSystem.root.getFile(
                    "dummy.html", 
                    {create: true, exclusive: false}, 
                    function gotFileEntry(fileEntry){

                        var sPath = fileEntry.fullPath.replace("dummy.html", "");
                        fileEntry.remove();

                        var fileTransfer = new FileTransfer();
                        fileTransfer.download(
                            url,
                            sPath + filename,
                            function(theFile) {
                                deferred.resolve(theFile.toURI());
                            },
                            function(error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("upload error code: " + error.code);
                                deferred.reject();
                            }
                        );
                    }, 
                    function(evt){ //FAIL
                        console.log(evt.code + "-" + evt.message);
                        deferred.reject();
                    }
                );
            });
            return deferred.promise;
	    } 
	}
}]);