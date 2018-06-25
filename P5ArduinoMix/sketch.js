var serial; // variable to hold an instance of the serialport library
var options = { baudrate: 9600 }; // set baudrate to 9600; must match Arduino baudrate
var portName = 'COM3'; // fill in your serial port name here
var inData; // for incoming serial data
var slider;
var vw = 800;
var vh = 500;

function setup() {
    createCanvas(vw, vh);
    serial = new p5.SerialPort(); // make a new instance of the serialport library
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.open(portName, options); // open a serial port @ 9600 

}

function draw() {
    background(255);
    let unidad = vw / 100;

    if (inData) {
        let posX = inData * unidad;
        ellipse(posX, 250, 80, 80)
    } else {
        background(150);
    }
}

function serialEvent() {
    // inData = Number(serial.read());   // can use this when just looking for 1 byte msgs from Arduino

    // Alternatively, read a string from the serial port, looking for new line as data separator:
    var inString = serial.readStringUntil('\r\n');
    // check to see that there's actually a string there:
    if (inString.length > 0) {
        // convert it to a number:
        console.log("inData :" + inData);
        inData = Number(inString);
    }
}


function serialError(err) {
    println('Something went wrong with the serial port. ' + err);
}