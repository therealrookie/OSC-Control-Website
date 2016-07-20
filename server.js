var app       =     require("express")();
var express   =     require("express");
var http      =     require('http').Server(app);
var io        =     require("socket.io")(http);
var osc       =     require('node-osc');
var oscServer =     new osc.Server(22223, '127.0.0.1');
var client    =     new osc.Client('127.0.0.1', 3000);

// ========== Pages ========== //
// Allows acess to all files inside 'public' folder.
app.use(express.static(__dirname + "/public"));

// Configures each link to a different page.
// e.g. localhost:3000/   will load index.html
// e.g. localhost:3000/led    will load led.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});






// ========== SOCKET.IO ========== //
/*  This is auto initiated event when Client connects to the server  */
io.on('connection',function(socket){  
    console.log("A user is connected");
});

// Hosts the page on port 3000
http.listen(3000,function(){
    console.log("Listening on 3000");
});


// ========== Data ========== //
//Sends OSC message when button is clicked
io.sockets.on('connection', function(socket){
  socket.on('send message', function(data){
    var oscNum = Math.random();
    var oscMap = '/composition/video/effect3/opacity/values ' + oscNum;

    client.send('/composition/video/effect3/opacity/values', oscNum);
    console.log(oscMap);
  });
});


