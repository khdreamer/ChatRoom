app.controller('rooms', function ($scope, $state, $stateParams, $location) {

  $scope.room_name = "Unknown Room";
  $scope.rooms = [];

  socket.emit("room_list");

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

  // select room
  $scope.selectRoom = function(room){

    socket.emit("room_history", room);
    $stateParams.room_name = room;
    $location.path("/" + room.replace(" ", "_"));

  }

});




