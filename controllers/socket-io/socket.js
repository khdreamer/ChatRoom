var chat_db = require("../../models/chat.js")
  , redis = require("redis");

var allClients = [];

module.exports = function (io){

  this.connect = function (socket){

    allClients.push(socket);

    console.log("connection");

    // get all rooms
    socket.on("room_list", function(){

      chat_db.allRooms(function (list){

        // excluding rooms whose roomnames are starting with 'sys.'

        list.forEach(function(el, idx){

          if(el.indexOf("sys.")==0){
            list[idx] = null;
          }

        });
        
        var list_str = list.join(',');
        list_str.replace(/,+/g, ',');
        newList = list_str.split(',');

        this.updateRoomList(socket, newList);

      });

    });

    // listen to request for room history
    socket.on("room_history", function (room){
      console.log('requesting room_history of room: '+ room);
      chat_db.all(room, function(list){
        this.all(socket, list); //emitting the history data of the room back to client
      });

    });
    
    socket.on("init_roommate_ids", function(room_name){

      console.log('got init_roommate_ids req, room: ' + room_name);
      
      chat_db.allVal('sys.'+room_name, function(list){
        console.log('listing roommates: ' + list);
        this.initRoommates(socket, list);
      });
      /*
      chat_db.all('sys.'+room_name, function(list){
        console.log('listing roommates: ' + list);
        this.initRoommates(socket, list);
      });
      */
    });

    socket.on('new_user', function(data){

      data.socket_id = socket.id; // add new field to the hash

      chat_db.createRoommates(data, function(){ //updating the new user info. into the database..
        
        this.updateNewRoommate(data);

      });

    });

    // listen to new message
    socket.on('message', function (data) {
      console.log("message received: " + (new Date()).getMilliseconds());

      chat_db.create(data, function(){
        console.log("message recorded: " + (new Date()).getMilliseconds());        
        this.update(data); //emitting the new data back to client
      });

    });

    // listen to call of creating new room
    socket.on('create_room', function (room_name) {
      
      console.log("create room: " + room_name);
      chat_db.create({
        room_name: room_name
      }, function(){
        console.log("message recorded: " + (new Date()).getMilliseconds());        
        this.all(socket, [{room_name: room_name}]);
      });

    });


    socket.on('disconnect', function(){

      console.log('got disconnection! socket_id: ' + socket.id);
      var idx = allClients.indexOf(socket);
      allClients.splice(idx,1);

      chat_db.deleteRoommates(socket.id, function(){
        console.log('delete roommate with socket_id: ' + socket.id);
      });

    });


  };



  this.update = function (data){

    io.sockets.emit('new', data);

  };

  this.all = function (socket, history){

    socket.emit('room_history', history);

  };

  this.updateRoomList = function (socket, list){
    console.log("updateRoomList executed, emitting: " + list);
    socket.emit('room_list', list);
  }
  
  this.initRoommates = function(socket, list){
    console.log("initRoommates executed, emitting: " + list);
    socket.emit('init_roommate_ids', list);
  }
  /*
  this.updateRoommates = function(list){ //updating roommates list to every client
    console.log("updateRoommates executed, emitting: " + list);
    io.sockets.emit('update_roommate_ids', list);
  }
  */
  this.updateNewRoommate = function(data){ //updating roommates list to every client
    console.log("updateNewRoommate executed, emitting: " + data);
    io.sockets.emit('update_new_roommate_id', data);
  }

  return this;

}



