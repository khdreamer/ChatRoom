exports.connect = function (socket) {

  console.log("connection");
  socket.on('message', function (data) {
    console.log(data);
  });

};