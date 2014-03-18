app.directive('messageBox', function () {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {

      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          console.log("enter message");
          socket.emit('message', {
            message: scope.message, 
            user_name: scope.user_name,
            room_name: scope.room_name
          });
          scope.message_field = "";
          console.log("message sent: " + (new Date()).getMilliseconds());
          event.preventDefault();
        }
      });
    }
  }

});
