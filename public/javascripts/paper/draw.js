tool.minDistance = 10;
tool.maxDistance = 45;

var path_to_send = {};
console.log("paper");

/*------- Colors -------*/

var active_color_rgb = new RgbColor( 0, 0, 0, 0.5 );
    active_color_rgb._alpha = 0.5;
var active_color_json = {
  red: 0,
  green: 0,
  blue: 0,
  opacity: 0.5,
};

/*------- Drawing Functions -------*/

var external_paths = {};

// Ends a path
var end_external_path = function( points, artist ) {

  var path = external_paths[artist];

  if ( path ) {

    // Close the path
    path.add(points.end);
    path.closed = true;
    path.smooth();

    // Remove the old data
    external_paths[artist] = false;

  }

};

// Continues to draw a path in real time
var progress_external_path = function( points, artist ) {

  var path = external_paths[artist];

    // The path hasnt already been started
    // So start it
    if ( !path ) {

      // Creates the path in an easy to access way
      external_paths[artist] = new Path();
      path = external_paths[artist];

      // Starts the path
      var start_point = new Point(points.start.x, points.start.y);
      var color = new RgbColor( 
        points.rgba.red, 
        points.rgba.green, 
        points.rgba.blue, 
        points.rgba.opacity
      );
      path.fillColor = color;
      path.add(start_point);

    }

  // Draw all the points along the length of the path
  var paths = points.path;
  var length = paths.length;
  for (var i = 0; i < length; i++ ) {

    path.add(paths[i].top);
    path.insert(0, paths[i].bottom);

  }

  path.smooth();
  view.draw();

};

/*------- Events -------*/

var send_paths_timer;
var timer_is_active = false;

function onMouseDown(event) {

  var point = event.point;

  path = new Path();
  path.fillColor = active_color_rgb;
  path.add(event.point);

    // The data we will send every 100ms on mouse drag
    path_to_send = {
      rgba : active_color_json,
      start : event.point,
      path : []
    };

  }

function onMouseDrag(event) {

  var step = event.delta / 2;
  // console.log("step: " + step + "\nev.d: " + event.delta);
  step.angle += 90;

  var top = event.middlePoint + step;
  var bottom = event.middlePoint - step;
  
  path.add(top);
  path.insert(0, bottom);
  path.smooth();

  // Add data to path
  path_to_send.path.push({
    top : top,
    bottom : bottom
  });

  // Send paths every 100ms
  if ( !timer_is_active ) {

    send_paths_timer = setInterval( function() {

      socket.emit('draw:progress', user_id, JSON.stringify(path_to_send) );
      path_to_send.path = new Array();

    }, 100);

  }

  timer_is_active = true;

}


function onMouseUp(event) {

  // Close the users path
  path.add(event.point);
  path.closed = true;
  path.smooth();

  // Send the path to other users
  path_to_send.end = event.point;
  socket.emit('draw:end', user_id, JSON.stringify(path_to_send) );

  // Stop new path data being added & sent
  clearInterval(send_paths_timer);
  path_to_send.path = new Array();
  timer_is_active = false;

}

// socket

socket.on('draw:progress', function( artist, data ) {

  // It wasnt this user who created the event
  if ( artist !== user_id && data ) {

    console.log("draw:progress");
    progress_external_path( JSON.parse( data ), artist );

  }

}); 

socket.on('draw:end', function( artist, data ) {
  

  // It wasn't this user who created the event
  if ( artist !== user_id && data ) {
    console.log("draw:end");
    end_external_path( JSON.parse( data ), artist );
  }

});

