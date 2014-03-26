app.controller('chat', function ($scope, $state, $stateParams, $location, $anchorScroll) {

  $scope.history = []; //history data in chatrooms
  $scope.user_name = user_name;
  $scope.room_name = "";

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
    //console.log("message received: " + (new Date()).getMilliseconds());
    
    $scope.$apply();

  });

});




