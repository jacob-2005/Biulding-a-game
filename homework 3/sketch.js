let pacMan1X = 50;
let pacMan1Y = 50;

let littleDotsX = 250;
let littleDotsY = 250;

const littleDotsDiameter = 10;
const littleDotsRadius = littleDotsDiameter / 2;
const pacManDiameter = 80;
const pacManRadius = pacManDiameter / 2;
const velocity = 10;


let mouthCount;
let increaseMouthCount;
let direction = -1;
const FRAME_RATE = 60;
let lookingDirection = 0;
let circleColors = [];
let defaultColor; 

function setup() {
  mouthCount = QUARTER_PI;
  increaseMouthCount = QUARTER_PI/FRAME_RATE * 2;
  defaultColor = color(255, 255, 0);
  for(let i = 0; i < 10; i+= 1) {
    circleColors.push(defaultColor);
  }
  
  createCanvas(500, 500);
  noStroke();
  frameRate(FRAME_RATE)
}

function draw() {
  background(150);
  littleDots();
  pacMan();

}

function pacMan() {
  fill(255, 255, 0);
  mouthCount += direction * increaseMouthCount;
  const bottomJawArc = mouthCount + lookingDirection; 
  const topJawArc = -mouthCount + lookingDirection;

  if (frameCount % (FRAME_RATE / 2) === 0) {
    direction = direction * -1;
  }
  arc(pacMan1X, pacMan1Y, pacManDiameter, pacManDiameter, bottomJawArc, topJawArc, PIE);

}
function keyPressed(event) {
  const key = event.key;
  if (key == 'ArrowLeft') {
    pacMan1X = pacMan1X - velocity;
    lookingDirection = PI;
  } else if (key == 'ArrowRight') {
    pacMan1X = pacMan1X + velocity;
    lookingDirection = TWO_PI;
  } else if (key == 'ArrowUp') {
    pacMan1Y = pacMan1Y - velocity;
    lookingDirection = PI + HALF_PI;
  } else if (key == 'ArrowDown') {
    pacMan1Y = pacMan1Y + velocity;
    lookingDirection = HALF_PI;
  } 
}
function littleDots() {
  const radius = 20;
  for (let i = 0; i < 10; i+= 1) {
    let circleColor = circleColors[i];
    if(circleColor !== defaultColor) {
      continue;
    }
    const littleDotsX = i * (radius * 2)  + 30;
    const littleDotsY = 250;
    const changeX = abs(littleDotsX - pacMan1X);
    const changeY = abs(littleDotsY - pacMan1Y);

    
    // Pythagoream's Theorum
    const distance = Math.sqrt((changeX * changeX) + (changeY * changeY));
    const collissionDetected = distance < (pacManRadius + radius);
    if (collissionDetected) {
      circleColor = color(150, 0);
      circleColors[i] = circleColor;
    }
    fill(circleColor);
    ellipse(littleDotsX, littleDotsY, radius, radius);
}
}