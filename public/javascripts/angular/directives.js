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

app.directive('rain', function () {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {

      element.bind("load" , function(event){ 

        var engine = new RainyDay({
          
          image: element[0],
          parentElement: element.parent()[0]
          
        });
        engine.rain([ [1, 2, 8000] ]);
        engine.rain([ [3, 3, 0.88], [5, 5, 0.9], [6, 2, 1] ], 100);
        element.css("display", "none");
      
      });

    }
  }
});

app.directive('chatContent', 
  ['$location', '$anchorScroll', function ($location, $anchorScroll) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {

      // console.log(scope.history);
      scope.$watch("history", function(){

        $location.hash('bottom');
        $anchorScroll();
        $location.hash('');
        console.log("scroll");

      }, true);

    }
  }
}]);

