var redis = require("redis")
  , client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

exports.all = function(callback){

  client.llen("history", function(err, length){ // get length

    client.lrange("history", 0, length, function(err, list){ // get list content
      
      if(callback) callback(list);
      
    });

  });

}

exports.create = function(data, callback){

  console.log("create");
  client.rpush("history", [JSON.stringify(data)], function(err, num){ 

    callback();
      
  });
    
}
