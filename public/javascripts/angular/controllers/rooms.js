app.controller('rooms', function ($scope, $state, $stateParams, $location) {

  $scope.room_name = "Unknown Room";
  $scope.rooms = [];
  $scope.create = false;

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
    // $location.path("/room/" + room.replace(" ", "_"));
    $location.path("/video/" + room.replace(" ", "_"));

  }

  $scope.createRoom = function(){

    socket.emit("create_room", $scope.room_name);
    $stateParams.room_name = $scope.room_name;
    $location.path("/" + $scope.room_name.replace(" ", "_"));
  }

});




