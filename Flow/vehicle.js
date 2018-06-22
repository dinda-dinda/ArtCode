// Dinda Dinda
// Flow Field Following


// The "Vehicle" constructor

function Vehicle(x,y,ms,mf) {
  this.position = createVector(x,y);
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,0);
  this.r = 4;
  this.maxspeed = ms || 4;
  this.maxforce = mf || 0.1;

  this.run = function() {
    this.update();
    this.borders();
    this.display();
  }

  // Implementing Reynolds' flow field following algorithm
  // http://wwwred3d.com/cwr/steer/FlowFollow.html
  this.follow = function(flow) {
    
    var desired = flow.lookup(this.position);  // What is the vector at that spot in the flow field?
    desired.mult(this.maxspeed);               // Scale it up by maxspeed
    
    var steer = p5.Vector.sub(desired, this.velocity);    // Steering is desired minus velocity
    steer.limit(this.maxforce);                         // Limit to maximum steering force
    this.applyForce(steer);
  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M

    //Agregar!!!!!!!!!!!!!
    this.acceleration.add(force);
  }

  this.applyBehaviors = function(vehicles){
    
    var separateForce = this.separate(vehicles);
    var seekForce = this.seek(createVector(mouseX,mouseY));
    
    separateForce.mult(sliderSeparateForce.value());
    seekForce.mult(sliderSeekForce.value());
    
    this.applyForce(separateForce);
    this.applyForce(seekForce);
  }
  
  /*------------seek-----------------*/
   // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  
  
  this.seek = function(target){
    var desired = p5.Vector.sub(target,this.pos);
    desired.normalize();                            //normalizo y lo paso a su maxima velocidad
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired,this.velocity); //steer minus desired velocity
    steer.limit(this.maxforce);                       // Limit to maximum steering force
    return steer;
  }
  
  
  /*------------separate-----------------*/
  this.separate = function(vehicles){
    var desiredseparation = 20;
    var sum = createVector();
    var count = 0;
    //check if its to close
     for (var i = 0; i < vehicles.length; i++) {
      var d = p5.Vector.dist(this.position, vehicles[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    
      if ((d > 0) && (d < desiredseparation)) {
        
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position, vehicles[i].position);
        diff.normalize();
        diff.div(d);        // Weight by distance
        sum.add(diff);
        count++;            // Keep track of how many
      }
    }
  // Average -- divide by how many
    if (count > 0) {
      sum.div(count);
      // Our desired vector is the average scaled to maximum speed
      sum.normalize();
      sum.mult(this.maxspeed);
      // Implement Reynolds: Steering = Desired - Velocity
      sum.sub(this.velocity);
      sum.limit(this.maxforce);
    }
    return sum;
  }
/**----------------------------------------------*/
  
    // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  // Wraparound
  this.borders = function() {
    if (this.position.x < -this.r) this.position.x = width+this.r;
    if (this.position.y < -this.r) this.position.y = height+this.r;
    if (this.position.x > width+this.r) this.position.x = -this.r;
    if (this.position.y > height+this.r) this.position.y = -this.r;
  }

  this.display = function() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + PI/2;
    fill(250,0,random(180,220));
    noStroke(200);
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);
    pop();
  }
}
