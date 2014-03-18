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

  console.log("create" + JSON.stringify(data) + "with room_name = " + JSON.stringify(data.room_name));
  
  client.rpush(data.room_name, JSON.stringify(data), function(err, num){ 

    callback();
      
  });

  /*
  client.rpush("history", JSON.stringify(data), function(err, num){ 

    callback();
      
  });
*/
    
}
