myApp.factory('fileService',['$q',function($q){
    
    var storageLimitMB = 50;
     
    




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
            var filename = url.substr(url.lastIndexOf("/")+1);
            var deferred = $q.defer();

            function getFile(url){
                var deferred = $q.defer();
                var request;
                var handler = function(){
                    deferred.resolve(request.responseText);
                }
                if(window.XDomainRequest){
                    request = new window.XDomainRequest();
                    request.onload = handler
                } else{
                    request = new XMLHttpRequest();
                    request.onreadystatechange = handler;
                }
                request.open('GET', url, true);
                request.send();
                return deferred.promise;
            }
            getFile(url).then(function(blob){
                var blob = new Blob([blob],{type:"image/png"});
                function gotFS(fs) {
                    fs.root.getFile(filename, {create: true}, function(DatFile) {
                        DatFile.createWriter(function(DatContent) {
                            DatContent.write(blob);
                            deferred.resolve(filename);
                        });
                    });
                }
                if(navigator.webkitTemporaryStorage.requestQuota){
                    navigator.webkitPersistentStorage.requestQuota(1024*1024, function() {
                        window.webkitRequestFileSystem(window.PERSISTENT , 1024*1024, gotFS);
                    })
                }else{
                    window.webkitRequestFileSystem(window.PERSISTENT , 1024*1024, gotFS);
                }
            });



            return deferred.promise;

            // getFileSystem().then(function(fs){
            //     fs.root.getFile(
            //         "dummy.html", 
            //         {create: true, exclusive: true}, 
            //         function (fileEntry){
            //             var sPath = fileEntry.fullPath.replace("dummy.html", "");
            //             fileEntry.remove();

            //             var fileTransfer = new FileTransfer();
            //             fileTransfer.download(
            //                 url,
            //                 sPath + filename,
            //                 function(theFile) {
            //                     deferred.resolve(theFile.toURI());
            //                 },
            //                 function(error) {
            //                     console.log("download error source " + error.source);
            //                     console.log("download error target " + error.target);
            //                     console.log("upload error code: " + error.code);
            //                     deferred.reject();
            //                 }
            //             );
            //         }, 
            //         function(evt){ //FAIL
            //             console.log(evt.name + "-" + evt.message);
            //             deferred.reject();
            //         }
            //     );
            // });
	    } 
	}
}]);