var createError = require('http-errors');
var http = require('http');
const WebSocket = require('ws');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const mongoStore = require('connect-mongo')(session);
var passport = require('passport')
var https = require('https');
var fs = require('fs');
require('dotenv').config()

//---------- DATABASE CONNECTION -------------

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//----------------------------------------------

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
sessionParser = session({
    store: new mongoStore({
        url: process.env.MONGO_URL
    }),
    secret: process.env.MONGO_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: (process.env.NODE_ENV == 'production')? true : false }
})
app.use(sessionParser)
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; 

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var sslOptions = {
    key: fs.readFileSync('keys/server.key'),
    cert: fs.readFileSync('keys/server.crt'),
    rejectUnauthorized: false
};

var server = https.createServer(sslOptions,app);

// var server = http.createServer(app);

//initialize and set up web socket server
const wss = new WebSocket.Server({ server: server });
last20 = [ ];//store 20 most recent messages
wss.on('connection', (ws, req) => {
    //obtain user name from request's session cookie
    ws.upgradeReq = req;
	// if(last20.length > 0){//if there are recent messages logged, send to client on connected
	// 	for(var i=0; i<last20.length; i++){		
	// 		ws.send(last20[i]);
	// 	}
	// }
    ws.on('message', (data) => { //echo each message received to all clients
        data = JSON.parse(data);
        var date = new Date();
        var obj = {user: data.username, message: data.message, datetime: date};
		last20.push(JSON.stringify(obj)); //log message
		last20 = last20.slice(-20); //only keep 20 most recent
		wss.clients.forEach(function each(client) {
			client.send(JSON.stringify(obj)); //echo message to all clients
		});
    });
});
module.exports = {app: app, server: server};

