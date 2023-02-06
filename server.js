let app       =     require("express")();
let express   =     require("express");
let http      =     require('http').Server(app);
let io        =     require('socket.io')(http);
let osc       =     require('node-osc');
let oscServer =     new osc.Server(22223, '127.0.0.1');
let client    =     new osc.Client('127.0.0.1', 3000);

const joystick = document.querySelector('.joystick');
const knob = document.querySelector('.knob');

let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

knob.addEventListener("mousedown", dragStart);
knob.addEventListener("mouseup", dragEnd);
knob.addEventListener("mouseout", dragEnd);
knob.addEventListener("mousemove", drag);

function dragStart(e) {
    initialX = 0;//e.clientX - xOffset;
    initialY = 0;//e.clientY - yOffset;

    isDragging = true;
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    isDragging = false;

    xOffset = 0;
    yOffset = 0;
    setTranslate(joystick.offsetWidth / 2 - 1, joystick.offsetHeight / 2 - 1, knob);
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, knob);

    }
}

function setTranslate(xPos, yPos, el) {
    //if (!isDragging)
    //	xPos = yPos = 0;

    el.style.left = xPos + "px";
    el.style.top = yPos + "px";
}

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
  socket.on('send message', function(x, y){


      let oscAddress = "/P2Movement";
      let oscArguments = [x, y];

      let oscMessage = new osc.Message(oscAddress);
      oscMessage.append(oscArguments[0]);
      oscMessage.append(oscArguments[1]);


      client.send(oscMessage);
    console.log(oscMessage);
  });
});


