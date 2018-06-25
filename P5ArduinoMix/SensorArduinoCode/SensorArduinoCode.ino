/*Dinda 2018*/

#define TRIGGER_PIN 13  // Arduino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN 12  // Arduino pin tied to echo pin on the ultrasonic sensor.
int maxDistance = 200;
int delayValue = 250;

///////////////////////////////new smoothing
const int numReadings = 10;

int readings[numReadings];      // the readings from the analog input
int readIndex = 0;              // the index of the current reading
int total = 0;                  // the running total
int average = 0;                // the average

//int inputPin = A0;
////////////////////////////////

void setup() {
  Serial.begin(9600); // Open serial monitor at 9600 baud to see ping results.
 pinMode(TRIGGER_PIN, OUTPUT);
 pinMode(ECHO_PIN, INPUT);

  // Smoothing!!!  //////////////initialize all the readings to 0:
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }
}
  
void loop() {
  
 long duration, distance;
  digitalWrite(TRIGGER_PIN, LOW);  // Added this line
  delayMicroseconds(2); // Added this line
  digitalWrite(TRIGGER_PIN, HIGH);
  delayMicroseconds(10); // Added this line
  digitalWrite(TRIGGER_PIN, LOW);
  duration = pulseIn(ECHO_PIN, HIGH);
  distance = (duration/2) / 29.1;

  if(distance > maxDistance){
    distance = maxDistance;
    }
  
  //to deliver a percentage 
  int distancePercentage = int((distance*100)/maxDistance);
  
  //Serial.println(distancePercentage);

////////smoothing////////////////////////// subtract the last reading:
  total = total - readings[readIndex];
  // read from the sensor:
  readings[readIndex] = distancePercentage; //agrego la lectura!
  // add the reading to the total:
  total = total + readings[readIndex];
  // advance to the next position in the array:
  readIndex = readIndex + 1;

  // if we're at the end of the array...
  if (readIndex >= numReadings) {
    // ...wrap around to the beginning:
    readIndex = 0;
  }

  // calculate the average:
  average = total / numReadings;
  // send it to the computer as ASCII digits
  Serial.println(average);
  delay(delayValue);  
  ///////////////////////////////////smoothing ends
 
 }
