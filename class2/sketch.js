let radius = 50;
let y = 0;
let speed = 1;
let direction = 1;
let coolDown = 0;

function setup() {
  createCanvas(150, 150);
  frameRate(60);
}



function draw() {
  let x = width-100;
  coolDown = coolDown +1;
  console.log(coolDown)
  background(150);
  line(0, 75, 150, 75);
  fill(255, 0, 255);
    y += -speed * -direction;
    if ((y > height-radius) || (y < 0)) {
      direction = -direction;
      coolDown = 0;
      console.log (coolDown);
      }
    if (coolDown = 0){
        radius = radius +5;
        console.log (radius);
      }

      rect(x, y, radius, radius);
}