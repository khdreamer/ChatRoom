var chat_db = require("../../models/chat.js")
  , redis = require("redis");

module.exports = function (io){

  this.connect = function (socket){

    console.log("connection");

    // return all history messages
    // chat_db.all(function(list){
    //   this.all(socket, list); //emitting the history data back to client
    // });

    chat_db.allRooms(function (list){
      //console.log("room lists: " + list);
      this.updateRoomList(socket, list);
    });
    
    // send back room history
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



