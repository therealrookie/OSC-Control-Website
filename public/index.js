import { io } from "socket.io-client";
const joystick = document.querySelector('.joystick');
const knob = document.querySelector('.knob');

const socket = io('http://localhost:3000');

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

        sendOSC(currentX, currentY);
    }
}

function setTranslate(xPos, yPos, el) {
    //if (!isDragging)
    //	xPos = yPos = 0;

    el.style.left = xPos + "px";
    el.style.top = yPos + "px";
}


