var chat_db = require("../../models/chat.js")
  , redis = require("redis");

module.exports = function (io){

  this.connect = function (socket){

    console.log("connection");

    // get all rooms
    socket.on("room_list", function(){

      chat_db.allRooms(function (list){

        this.updateRoomList(socket, list);

      });

    });

    // listen to request for room history
    socket.on("room_history", function (room){

      chat_db.all(room, function(list){
        this.all(socket, list); //emitting the history data of the room back to client
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

    // drawing events
    socket.on('draw:begin', function (user_id, data) {
      
      io.sockets.emit('draw:begin', user_id, data);
      console.log("draw:begin");

    });

    socket.on('draw:drag', function (user_id, data) {
      
      io.sockets.emit('draw:drag', user_id, data);
      console.log("draw:drag");

    });

    socket.on('draw:end', function (user_id) {
      
      io.sockets.emit('draw:end', user_id);

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

  return this;

}



