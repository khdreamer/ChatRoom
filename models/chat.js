var redis = require("redis")
  , client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

exports.allRooms = function(callback){

  console.log("rooms: " + client.KEYS);

  client.keys("*", function(err, list){ // get list of keys (room names)
      
    if(callback) callback(list);
    
  });

}

exports.all = function(room_name, callback){

  client.llen(room_name, function(err, length){ // get length

    //console.log("length = " + length);
    client.lrange(room_name, 0, length, function(err, list){ // get list content
      
      if(callback) callback(list);
      
    });

  });

}

exports.create = function(data, callback){

  console.log("create");

  //console.log("create" + JSON.stringify(data) + "with room_name = " + JSON.stringify(data.room_name));
  
  client.rpush(data.room_name, JSON.stringify(data), function(err, num){ 

    callback();
      
  });
    
}


exports.allVal = function(room_name, callback){

  client.hvals(room_name, function(err,list){ // return all values in the hash

    if(callback) callback(list);

  });

}

exports.createRoommates = function(data, callback){
  
  console.log("createRoommates, key: sys." + data.room_name + ", field: " + data.socket_id + ", value: " + data.user_id);

  client.hset('sys.' + data.room_name, data.socket_id, data.user_id, function(err,num){

    callback();

  });

}

exports.deleteRoommates = function(data, callback){ // 'data' is the socket_id of disconnected socket

  //console.log("deleteRoommate, key: sys." + data.room_name+ ", field: " + , value: " + data.user_id);

  client.keys('sys.*', function(err,list){

    client.hdel(list, data.field, function(err,num){
      callback();
    });

  });

}
