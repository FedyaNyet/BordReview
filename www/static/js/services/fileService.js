myApp.factory('fileService',['$q',function($q){

	return {
		// checkFileNeedsDownload: function(path){
  //           var deferred = $q.defer();
  //           getFileSystem().then(function(fs){
  //               fs.root.getFile(path,{},
  //                   function(){
  //                       //it exists..
  //                       deferred.reject();
  //                   },function(er){
  //                       //it can't be opened...
  //                       console.log(er);
  //                       deferred.resolve(path);
  //                   });
  //           });
  //           return deferred.promise;
		// },
		downloadFile: function(url){

            console.log(url);
            var deferred = $q.defer();
            
            window.webkitRequestFileSystem(window.PERSISTENT , 2*1024*1024, function(fs){
                var filename = url.substr(url.lastIndexOf("/")+1);
                fs.root.getFile("derp.txt", {create: true}, function(file) {
                    var sPath = file.fullPath.replace("derp.txt","");
                    console.log(sPath, file);
                    // file.remove(); //remove it so we can use the name
                    (new FileTransfer()).download(
                        url,
                        sPath + filename,
                        function(theFile) {
                            console.log("download complete: " + theFile.toURI());
                            promise.resolve(theFile.toURI())
                        },
                        function(error) {
                            console.log("download error source " + error.source);
                            console.log("download error target " + error.target);
                            console.log("upload error code: " + error.code);
                        }
                    );
                });
            });
            return deferred.promise;
	    } 
	}
}]);