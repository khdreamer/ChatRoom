var db = require("../../models/db.js")
  , redis = require("redis");

module.exports = function(io){

  this.connect = function(socket){

    console.log("connection");

    // return all history meassages
    db.all(function(list){
      this.all(socket, list);
    });

    // listen to new message
    socket.on('message', function (data) {
      console.log("message received: " + (new Date()).getMilliseconds());
      db.create(data, function(){

        console.log("message recorded: " + (new Date()).getMilliseconds());        
        this.update(data);

      });
    });

  };

  this.update = function(data){

    io.sockets.emit('new', data);

  };

  this.all = function(socket, history){

    socket.emit('history', history);

  };

  return this;

}



