// Dinda Dinda
// Flow Field Following

// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

// Using this variable to decide whether to draw all the stuff
var debug = true;

// Flowfield object
var flowfield;
// An ArrayList of vehicles
var vehicles = [];
var sliderSeparateForce;
var sliderSeekForce;


function setup() {

  createCanvas(windowWidth, windowHeight);
  // Make a new flow field with "resolution" of 16
  
  sliderSeparateForce = createSlider(0,1000,50,1);
  sliderSeekForce = createSlider(0,1000,50,1);
  
  flowfield = new FlowField(16);
  // Make a whole bunch of vehicles with random maxspeed and maxforce values
  for (var i = 0; i < 120; i++) {
    vehicles.push(new Vehicle(random(width/3), random(height), random(2, 5), random(0.1, 0.5)));
  }
}

function draw() {
  background(10,10);
  // Display the flowfield in "debug" mode
  if (debug) flowfield.display();
  // Tell all the vehicles to follow the flow field
  for (var i = 0; i < vehicles.length; i++) {
    /*si los vehicles estan mas alla del tercio de la pantalla*/
    if(vehicles[i].position.x > windowWidth/3){ 
      
    /*aplico seek and separate force and follow no*/
    
      vehicles[i].applyBehaviors(vehicles);
   
     // vehicles[i].follow(flowfield);
    } else {
      
    /*si no que sigan el followfield*/
    vehicles[i].follow(flowfield);
    }
    vehicles[i].run();
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


