myApp.factory('fileService',['$q',function($q){

    console.log("fileService");
    return {
        downloadFile: function(url){

            alert("downloading"+url);
            var deferred = $q.defer();
                
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            var LocalFileSystem = LocalFileSystem || window;
            console.log(window.requestFileSystem, LocalFileSystem);
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 2*1024*1024, function(fs){
                alert("GOT FS", fs);
                fs.root.getFile("derp.txt", {create: true, exclusive: false}, 
                    function(file) {
                        alert("fullPath:"+file.fullPath + " name:"+file.name);
                        var sPath = file.fullPath.replace("derp.txt","");
                        // file.remove(); //remove it so we can use the name
                        var filename = url.substr(url.lastIndexOf("/")+1);
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