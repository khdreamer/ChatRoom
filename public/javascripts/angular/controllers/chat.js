app.controller('chat', function ($scope, $state, $stateParams, $location) {

  $scope.history = []; //history data in chatrooms
  $scope.user_name = user_name;
  $scope.room_name = "";
  $scope.showImgBox = false;

  // stickers setup
  $scope.stickers = [];
  for (var i = 1 ; i <=3 ; i++ ){
    $scope.stickers.push("/images/sticker" + i + ".jpg");
  }


  socket.emit("room_history", $stateParams.roomName.replace("_", " "));
  console.log("sp: " + $stateParams.roomName);

  // get full list of history: rewrite
  socket.on('room_history', function (data) {
    
    $scope.history = [];
    console.log(data);
    $scope.room_name = JSON.parse(data[0])["room_name"];
    data.forEach(function(el){

      $scope.history.push(JSON.parse(el));

    });
    //console.log(data);
    $scope.$apply();

  });

  // get new message: append
  socket.on('new', function (data) {

    $scope.history.push(data);

    //console.log(data);
    console.log("message received: " + (new Date()).getMilliseconds());
    
    $scope.$apply(); 

  });

  // go back to rooms

  $scope.backToRooms = function(room){

    $state.go("rooms");

  }

  $scope.switchImgBox = function(){
    if( $scope.showImgBox )
      $scope.showImgBox = false;
    else $scope.showImgBox = true;
    console.log($scope.showImgBox);
  }

  $scope.sendSticker = function(stickerPath){
    $scope.history.push("<img src=\"" + stickerPath + "\"/> ");
    // 
    //showImgBox = false;
    //$scope.$apply();
  }
});




