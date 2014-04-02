myApp.factory('fileService',['$q',function($q){
 
    var getFileSystem = function(){
        if(navigator.webkitTemporaryStorage.requestQuota){
            navigator.webkitTemporaryStorage.requestQuota(
                5*1024*1024,
                function(size){ console.log('gotStorage quota'); gotStorage(size); }, 
                function(e) { console.log('Error', e); }
            );
        }else{
            gotStorage(5*1024*1024);
        }

        var gotStorage = function(grantedBytes){
            window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(fs){
                fileSystem = fs;
                console.log('Opened file system: ' + fs.name);
            }, function(e){console.log(e);});
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
                    console.log(evt.target.error.code);
                    deferred.reject();
                }
            );
            return deferred.promise;
	    } 
	}
}]);