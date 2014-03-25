app.controller('upload', function ($scope, $upload) {

  $scope.img_path = null;

  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {

      var file = $files[i];

      // socket.emit("change_img");
      $scope.upload = $upload.upload({
        url: '/upload',
        file: file,
      }).progress(function(evt) {
        
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));

      }).success(function(data, status, headers, config) {



      });
      
    }
  
  };

  socket.on('img_path', function (path) {

    console.log(path);
    $scope.img_path = path;
    $scope.$apply(); 

  });

});