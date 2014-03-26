app.controller('draw', function ($scope) {

  /*------- init -------*/

  function init(){
    paper.install(window);
    paper.setup('main');
    paper.view.draw();
  }
  init();

  /*------- rain -------*/
  $scope.random = Math.floor(Math.random()*10);

  /*------- drawing functions -------*/
  
  // mouse events

  var path;
  var drag = false;

  var color = new paper.Color(255, 0, 0, 0.6);
  // var color = 'red';
  var strokeWidth = 10;

  $scope.mouseDown = function(event){

    drag = true;
    path = new paper.Path({
      strokeColor: color,
      strokeWidth: strokeWidth
    });
    path.add(new paper.Point(event.x, event.y));

    emitPath('draw:begin', event.x, event.y);

  };

  $scope.mouseDrag = function(event){

    if(drag){
      
      path.add(new paper.Point(event.x, event.y));
      path.smooth();

      emitPath('draw:drag', event.x, event.y);

    }
  };

  $scope.mouseUp = function(){

    drag = false;
    socket.emit('draw:end', user_id);

  };

  var emitPath = function(key, x, y){

    socket.emit(key, user_id, JSON.stringify({

      point: { x: x, y: y },
      color: color

    }));

  }

  /*------- others' drawing -------*/

  $scope.external_paths = {};

  // draw others' path in real time
  $scope.begin_ext_path = function( artist, data ) {

    if ( !$scope.external_paths[artist] ) {

      $scope.external_paths[artist] = new paper.Path( {
        strokeColor: color,
        strokeWidth: strokeWidth
      });
      $scope.external_paths[artist].add( new paper.Point( data.point.x, data.point.y ) );

    }

    $scope.external_paths[artist].smooth();

  };

  $scope.drag_ext_path = function( artist, data ) {

    $scope.external_paths[artist].add( new paper.Point( data.point.x, data.point.y ) );
    $scope.external_paths[artist].smooth();
    paper.view.draw();

  };

  $scope.end_ext_path = function( artist ) {

    if ( $scope.external_paths[artist] ) {

      $scope.external_paths[artist] = null;

    }

  };

});



