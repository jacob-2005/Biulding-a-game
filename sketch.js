function setup() {
  // put setup code here
  createCanvas(500, 500);
  console.log('Hello World');
}

function draw() {
  // put drawing code here

  const x = frameCount;
  background(200);
  rect(x, frameCount, 50, 50);
  ellipse(x*2, frameCount, 50);
  //console.log(width);
}