app.controller('chat', function ($scope, $state, $stateParams, $location) {

  $scope.history = []; //history data in chatrooms
  $scope.user_name = user_name;
  $scope.room_name = "";
  
  //var my_audio_id = "";
  var roommate_ids = [];

  navigator.getUserMedia = navigator.getUserMedia || 
                           navigator.webkitGetUserMedia || 
                           navigator.mozGetUserMedia;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var localSourceNode = context.createMediaStreamSource;

  var peer = new Peer( user_id, { key: 'n0ti0wcjdu7919k9', debug: 3});
  console.log('user_id = ' + user_id);

  peer.on('open', function(){

      //console.log('THIS BROWSER opens a peer with id: ' + peer.id + ' == user_id: ' + user_id);
      console.log('THIS BROWSER opens a peer with id: ' + peer.id);
      //my_audio_id = peer.id; //get my audio id

  });

  peer.on('call', function(call){

    navigator.getUserMedia({audio: true}, function(stream){

      call.answer(stream);

    });

    call.on('stream', function(remoteStream){

      var sourceNode = createMediaStreamSource(remoteStream);
      sourceNode.connect( context.destination );

    });
    
  });



///////////////////////////////////////////////////////////////

  socket.emit("room_history", $stateParams.roomName.replace("_", " "));
  console.log("sp: " + $stateParams.roomName);

  // get full list of history: rewrite
  socket.on('room_history', function (data) {
    
    console.log('room_history: ' + data);
    
    $scope.history = [];
    $scope.room_name = JSON.parse(data[0])["room_name"]; // hash operation
    data.forEach(function(el){

      $scope.history.push(JSON.parse(el));

    });
    
    //get the intitial list of roommates
    socket.emit("init_roommate_ids", $scope.room_name);
    console.log('emitting init_roommate_ids req with room: ' + $scope.room_name);

    $scope.$apply();

  });
  


  socket.on('init_roommate_ids', function(list){
    
    list.forEach(function(el){

      roommate_ids.push(el);

    });
    console.log('receive init_roommate_ids, listing: ' + roommate_ids);
    
    
    // update roommate list in the server database because I'm new!
    socket.emit("new_user", { audio_id : peer.id, 
                              room_name: $scope.room_name });
    //console.log("emitting new_user req, audio_id: " + peer.id + ", room_name: " + $scope.room_name);


    //list roommates and call them
    console.log('List existing roommates and call them!');
    
    var call = [];
    list.forEach(function(roommate_id, idx){
      
      console.log('calling roommate with id: ' + roommate_id);

      navigator.getUserMedia({audio: true}, function(stream){

        call[idx] = peer.call('roommate_id', stream);

      });

    });
    
  });

  //get updated when new user enters the room, and call the new user!
  socket.on('update_new_roommate_id', function(data){

    roommate_ids.push(data.audio_id);
    
    console.log('receive update_new_roommate_id, data: ' + JSON.stringify(data));
    if(data.audio_id == user_id){
      console.log('the new user is me LOL');
    }
    
  });


  // get new message: append
  socket.on('new', function (data) {

    $scope.history.push(data);

    //console.log(data);
    //console.log("message received: " + (new Date()).getMilliseconds());
    
    $scope.$apply(); 

  });

  // go back to rooms

  $scope.backToRooms = function(room){

    $state.go("rooms");

  }
  
  /////////////////////////////////
  // video/audio processing
  //navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
  navigator.getUserMedia({audio: true}, function(stream){
        
        localSourceNode = context.createMediaStreamSource(stream);
        localSourceNode.connect( context.destination ); //local plaaaaaaaayBackkkkkk

  });
  
});




