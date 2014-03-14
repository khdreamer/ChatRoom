var db = require("../../models/db.js")
  , redis = require("redis");

module.exports = function(io){

  this.connect = function(socket){

    console.log("connection");

    /*
    // return all history messages
    db.all(function(list){
      this.all(socket, list); //emitting the history data back to client!
    });
    */

    

    // listen to new message
    socket.on('message', function (data) { // from directives.js
      console.log("message received: " + (new Date()).getMilliseconds());

      // return history messages which belong to room_name
      db.all(data, function(list){
        this.all(socket, list); //emitting the history data back to client!
      });

      db.create(data, function(){
        console.log("message recorded: " + (new Date()).getMilliseconds());        
        this.update(data); //emitting the new data back to client!
      });

      db.read(data, function(list){
        //console.log("room lists: " + list);
        this.updateRoomList(socket,list);
      });

    });

  };

  this.update = function(data){

    io.sockets.emit('new', data);

  };

  this.all = function(socket, history){

    socket.emit('history', history);

  };

  this.updateRoomList = function(socket, list){
    console.log("updateRoomList executed, emitting: " + list);
    socket.emit('room_list', list);
  }

  return this;

}



