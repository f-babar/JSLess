var UserController = require('../controllers/userController');
var passport = require('passport')
var express = require('express');
var router = express.Router();

/* GET Welcome page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET Chat page. */
router.get('/chat', function(req, res, next) {
  if(req.isAuthenticated()) {
    const data = {
      WEB_SOCKET_URL: process.env.WEB_SOCKET_URL,
      MAL_SOCKET_URL: process.env.MAL_SOCKET_URL,
      MAL_HTTP_URL: process.env.MAL_HTTP_URL,
      user: req.user
    }
    res.render('chat', data);
  } else {
    res.redirect('/');  
  }
});

/* Register */
router.post('/register', UserController.signup);

/* Login */
router.post('/login', UserController.login);

/* Logout */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');  
});

module.exports = router;
