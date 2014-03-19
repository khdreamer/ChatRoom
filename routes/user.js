var passport = require('passport');
var User = require('../models/user.js');

exports.registerPage = function(req, res) {
  res.render('users/register', { });
}

exports.register = function(req, res) {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render("users/register", {info: "Sorry. That username already exists. Try again."});
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
}

exports.loginPage = function(req, res) {
  res.render('users/login', { user : req.user });
}

exports.login = function(req, res) {
  res.redirect('/');
}

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}

exports.ping = function(req, res){
  res.send("pong!", 200);
}