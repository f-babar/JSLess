'use strict';
const User = require('../models/user');
const db = require('../helpers/database');
const bcrypt = require('bcrypt');
var passport = require('passport')

module.exports.signup = (req, res, next) => {
    
  const user_obj = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password 
  });
  
  db.findOne(User, { email: user_obj.email }, (response) => {
    if (response.success && !response.result) {
      db.findOne(User, { username: user_obj.username }, (response) => {
        if (response.success && !response.result) {
          bcrypt.hash(user_obj.password, 10, function(err, hash) {
            // Save User in the database
            user_obj.password = hash;
            db.create(User, user_obj, (response) => {
              if (response.success) {
                let user_data = response.result._doc;
                const user = {
                  _id : user_data._id,
                  full_name : user_data.first_name + ' ' + user_data.last_name,
                  username : user_data.username,
                  email : user_data.email
                }
                req.login(user, () => {
                  res.redirect('chat');
                })
              } else {
                res.render('index' , {signupError: "Something went wrong."});
              }
            })
          });
        } else {
          res.render('index', {signupError: "Username already registered."});
        }
      })
    } else {
      res.render('index', {signupError: "Email already registered."});
    }
  })
}

module.exports.login = (req, res, next) => {
    
  const user_obj = new User({
    email: req.body.email,
    password: req.body.password 
  });
  
  db.findOne(User, { email: user_obj.email }, (response) => {
    if (response.success && response.result) {
      bcrypt.compare(user_obj.password, response.result._doc.password, function(err, bcrypt_respose) {
        if(bcrypt_respose) {
          let user_data = response.result._doc;
          const user = {
            _id : user_data._id,
            full_name : user_data.first_name + ' ' + user_data.last_name,
            username : user_data.username,
            email : user_data.email
          }
          req.login(user, () => {
            res.redirect('chat');
          })
        } else {
          res.render('index', {loginError: "Incorrect Email or Password."});
        } 
      });
    } else {
      res.render('index', {loginError: "Incorrect Email or Password."});
    }
  })
}

passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});