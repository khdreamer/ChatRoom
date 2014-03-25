var fs = require('fs');

module.exports = function (io){

  var img_count = 0;
  this.upload = function(req, res){
    console.log(req.files);
    var file_name = req.files.file.name;
    var file_ext = file_name.substr(file_name.lastIndexOf("."), file_name.length);
    var new_path = "/uploads/" + img_count + file_ext;

    // fs.rename(req.files.file.path, new_path, function(err){

    //     io.sockets.emit("img_path", new_path);

    // });



    fs.readFile(req.files.file.path, function (err, data) {
      
      console.log(data);
      fs.writeFile("./public" + new_path, data, function (err) {

        io.sockets.emit("img_path", new_path);
        img_count++;
        // res.send("/uploads/" + req.files.file.name);

      });

    });
    
  };
  return this;

};