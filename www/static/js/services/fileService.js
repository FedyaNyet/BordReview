myApp.factory('fileService',['$q',function($q){

    return {
        downloadFile: function(url){

            var deferred = $q.defer();
        
            var LocalFileSystem = LocalFileSystem || window;
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 2*1024*1024, function(fs){
                fs.root.getFile("write-file-test.txt", {create: true, exclusive: false}, 
                    function(file) {
                        var filename = url.substr(url.lastIndexOf("/")+1);
                        var path = file.toURL().replace(file.name,"");
                        // file.remove(); //remove it so we can use the name
                        if(typeof FileTransfer === "undefined") return deferred.reject();
                        (new FileTransfer()).download(
                            encodeURI(url),
                            path + filename,
                            function(theFile) {
                                console.log('file downloaded');
                                console.log(theFile);
                                deferred.resolve(theFile.toURL(), theFile.fullPath);
                            },
                            function(error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("download error code: " + error.code);
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