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
          scope.message = "";
          console.log("message sent: " + (new Date()).getMilliseconds());
          event.preventDefault();
        }
      });
    }
  }

});

app.directive('draw', function () {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {

      socket.on('draw:begin', function( artist, data ) {

        // other people created this path
        if ( artist !== user_id && data ) {

          scope.begin_ext_path( artist, JSON.parse( data ) );

        }

      }); 

      socket.on('draw:drag', function( artist, data ) {

        // other people created this path
        if ( artist !== user_id && data ) {

          scope.drag_ext_path( artist, JSON.parse( data ) );

        }

      }); 

      socket.on('draw:end', function( artist ) {

        // other people created this path
        if ( artist !== user_id ) {

          scope.end_ext_path( artist );

        }

      }); 

    }
  }

});

