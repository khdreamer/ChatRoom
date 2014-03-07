app.directive('messageBox', function () {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {

            element.bind("keydown keypress", function (event) {
              if(event.which === 13) {
                console.log("enter message");
                socket.emit('message', scope.message);
                event.preventDefault();
              }
            });


          }
  }

});