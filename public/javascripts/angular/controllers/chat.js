app.controller('chat', function ($scope) {

  $scope.history = []; //history data in chatrooms
  $scope.user_name = "Scarlett Johnson";
  $scope.room_name = "Starbucks Taida";
  $scope.rooms = ["No existing room!"];

  // get full list of existing room names
  socket.on('room_list', function (data) {

    $scope.rooms = [];
    console.log("received data: " + data);

    data.forEach(function(el){

      $scope.rooms.push(el);

    });

    console.log(data);
    $scope.$apply(); 

  });

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

  // select room
  $scope.selectRoom = function(room){

    socket.emit("room_history", room);

  }

});




