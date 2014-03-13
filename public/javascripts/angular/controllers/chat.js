app.controller('chat', function ($scope) {

  $scope.history = [];
  $scope.user_name = "Anonymous";

  // get full list of history: rewrite
  socket.on('history', function (data) {
    $scope.history = [];
    data.forEach(function(el){
      $scope.history.push(JSON.parse(el));
    });
    console.log(data);
    $scope.$apply(); 
  });

  // get new message: append
  socket.on('new', function (data) {
    $scope.history.push(data);
    console.log(data);
    console.log("message received: " + (new Date()).getMilliseconds());
    $scope.$apply(); 
  });

});