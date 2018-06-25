function AirEnergy(x, y) {

    this.position = createVector(x, y);
    this.r = 12;

    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.2; // Maximum steering force
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);

    this.applyBehaviorsAir = function(airEnergys) {

        var separateForce = this.separate(airEnergys);
        var seekForce = this.seek();

        separateForce.mult(2);
        seekForce.mult(1);

        this.applyForce(separateForce);
        this.applyForce(seekForce);
    }


    this.applyForce = function(force) {
        // add mass here A = F / M
        this.acceleration.add(force);
    }


    // Separation
    // Method checks for nearby airEnergys and steers away
    this.separate = function(airEnergys) {
        var desiredseparation = 20;
        var sum = createVector();
        var count = 0;
        // For every boid in the system, check if it's too close
        for (var i = 0; i < airEnergys.length; i++) {
            var d = p5.Vector.dist(this.position, airEnergys[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                var diff = p5.Vector.sub(this.position, airEnergys[i].position);
                diff.normalize();
                diff.div(d); // Weight by distance
                sum.add(diff);
                count++; // Keep track of how many
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


    // STEER = DESIRED MINUS VELOCITY
    this.seek = function() {
        //  console.log("target en Seek: "+target);
        var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force
        return steer;
    }


    // Method to update location
    this.updateAir = function() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    this.displayAir = function() {
        // Draw a triangle rotated in the direction of velocity

        var theta = this.velocity;
        fill(100, 200, 0);
        stroke(100, 200, 0, 7);
        strokeWeight(25);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }


    // Wraparound
    this.bordersAir = function() {
        //   if (this.position.x < -this.r) this.position.x =  width+this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        //  if (this.position.x >  width+this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

}