app.controller('chat', function ($scope, $state, $stateParams, $location) {

  $scope.history = []; //history data in chatrooms
  $scope.user_name = "Your name here";

  socket.emit("room_history", $stateParams.roomName.replace("_", " "));
  console.log("sp: " + $stateParams.roomName);

  // get full list of history: rewrite
  socket.on('room_history', function (data) {
    
    $scope.history = [];
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

  // go back to rooms

  $scope.backToRooms = function(room){

    $state.go("rooms");

  }
});




