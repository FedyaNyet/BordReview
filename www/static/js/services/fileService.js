myApp.factory('fileService',['$q',function($q){

    console.log("fileService");
    return {
        downloadFile: function(url){

            console.log(url);
            var deferred = $q.defer();
            
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 2*1024*1024, function(fs){
                console.log("GOT FS", fs);
                var filename = url.substr(url.lastIndexOf("/")+1);
                fs.root.getFile("derp.txt", {create: true}, 
                    function(file) {
                        console.log(file);
                        var sPath = file.fullPath.replace("derp.txt","");
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
                    }, function(){
                        console.log("can't get file..");
                        deferred.reject();
                    }
                );
            },function(){
                console.log("Can't get FS");
                deferred.reject();
            });
            return deferred.promise;
        } 
    }
}]);