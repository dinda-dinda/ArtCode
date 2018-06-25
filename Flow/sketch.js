// Dinda Artist
// Flow Field Following
//Using Arduino serial port

// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

// Using this variable to decide whether to draw all the stuff
var debug = true;

// Flowfield object
var flowfield;
// Arrays of vehicles
var vehicles = [];
var airEnergys = [];


////linkeo con Arduino
var serial; // variable to hold an instance of the serialport library
var options = { baudrate: 9600 }; // set baudrate to 9600; must match Arduino baudrate
var portName = 'COM3'; // fill in your serial port name here
var inData; // for incoming serial data
var slider;
var windowWidth = 1366;
var windowHeight = 768;
    
var target;
//finished linkeo con Arduino

function setup() {

    createCanvas(windowWidth, windowHeight);
    // Make a new flow field with "resolution" of 16
    //linkeo con Arduino
    serial = new p5.SerialPort(); // make a new instance of the serialport library
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.open(portName, options); // open a serial port @ 9600 

    target = createVector(windowWidth,windowHeight/2);
    //finished linkeo con Arduino


    flowfield = new FlowField(16);
    // Make a whole bunch of vehicles with random maxspeed and maxforce values
    for (var i = 0; i < 120; i++) {
        vehicles.push(new Vehicle(random(width / 3), random(height), random(2, 5), random(0.1, 0.5)));
    }
}

function draw() {
     background(51,50);

    //linkeo con Arduino
    let unidad = (windowWidth) / 100;
    let arbol = 33*unidad;
/*    console.log("windowWidth"+windowWidth);
    console.log("unidad = windowWidth/100 : "+unidad);
    console.log("arbol = 33*unidad : "+arbol);*/

    if (inData) {
        let posX = int(inData * unidad);
        target = createVector(arbol+posX, windowHeight / 2);
        /*console.log("posX = inData * unidad :"+inData+" * "+unidad+" = "+posX);
        console.log("vector target X = arbol + posX :"+arbol+" + "+posX+" = "+(arbol+posX));
        console.log("vector target: arbol+posX, windowHeight/2 :"+target);*/
    }
    //end LInk arduino

    // Display the flowfield in "debug" mode
    if (debug) flowfield.display();
    
        // Tell all the vehicles to follow the flow field
        for (var i = 0; i < vehicles.length; i++) {
            /*si los vehicles estan mas alla del tercio de la pantalla*/
            if(inData>=80){ airEnergys = []; };

        if (vehicles[i].position.x > 0 && vehicles[i].position.x > windowWidth / 3 && airEnergys.length <= 10) {
            if(inData <= 10){
            let coordX = int(vehicles[i].position.x);
            let coordY = int(vehicles[i].position.y);

            airEnergys.push(new AirEnergy(coordX, coordY));
            }
        } else {
            vehicles[i].follow(flowfield); /*si no que sigan el followfield*/
            vehicles[i].applyBehaviors(vehicles);
            vehicles[i].run();
        }


    }
            for (var j = 0; j < airEnergys.length; j++) {
            airEnergys[j].applyBehaviorsAir(airEnergys);
            airEnergys[j].updateAir();
            airEnergys[j].bordersAir();
            airEnergys[j].displayAir();

        }

}


function keyPressed() {
    if (key == ' ') {
        debug = !debug;
    }
}

// Make a new flowfield
function mousePressed() {
    flowfield.init();
}

//linkeo conArduino
function serialEvent() {
    // inData = Number(serial.read());   // can use this when just looking for 1 byte msgs from Arduino

    // Alternatively, read a string from the serial port, looking for new line as data separator:
    var inString = serial.readStringUntil('\r\n');
    // check to see that there's actually a string there:
    if (inString.length > 0) {
        // convert it to a number:
       // console.log("inData :" + inData);
        inData = Number(inString);
    }
}


function serialError(err) {
    println('Something went wrong with the serial port. ' + err);
}
//finallinkARduino