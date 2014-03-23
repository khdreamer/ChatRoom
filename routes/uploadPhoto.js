/*
 *  Upload profile pcture
 */
require('../models/backgroundPicture.js');
//require('angular');
var mongoose = require('mongoose' );
var imgBack = mongoose.model('backgroundPicture');

exports.test = function(req, res){
  res.sendfile('./public/javascripts/angular/views/uploadPhoto.html');
};
