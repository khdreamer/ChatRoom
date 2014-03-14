app.directive('messageBox', function () {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {

            element.bind("keydown keypress", function (event) {
              if(event.which === 13) {
                console.log("enter message");
                socket.emit('message', {message: scope.message_field, user_name: scope.user_name_field, room_name: scope.room_name_field});
                scope.message_field = "";
                console.log("message sent: " + (new Date()).getMilliseconds());
                event.preventDefault();
              }
            });
          }
  }

});
