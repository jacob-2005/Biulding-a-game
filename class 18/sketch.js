const charactorWidth = 20;
let goodGuy;
let characterMoveDirection = null;
class Charactor {
  width = null;
  x = null;
  y = null
  velocity = 10;
  constructor(width, x, y){
    this.width = width;
    this.x = x;
    this.y = y;
  }
  move(direction){
    switch(direction){
      case 'right':
        this.x += this.velocity;
        break
      case 'left':
        this.x -= this.velocity;
        break
      case 'up':
        this.y -= this.velocity;
        break
      case 'down':
        this.y += this.velocity;
        break
    }
  }
  draw(){
    ellipse(this.x, this.y, this.width, this.width);
  }
  getData(){
    return {
      x: this.x, y: this.y
    }
  }
}
function setup() {
  createCanvas(500, 500);
  const data = hydrateData();
  const {user} = data;
  goodGuy = new Charactor(charactorWidth, user.x, user.y);
}

function draw() {
  background(0);
  goodGuy.draw();
}
function saveGame(){
  const saveData = {user: goodGuy.getData()}
  const serializedData = JSON.stringify(saveData);
  localStorage.saveData = serializedData;
}
function hydrateData(){
  if(localStorage.saveData){
    return JSON.parse(localStorage.saveData)
  }


  return {
    user: {x: 250, y: 250}
  }
  
}
function keyPressed(e){
  if(e.key == "Escape"){
    saveGame();
    }
  switch(e.key){
    case 'ArrowRight':
      goodGuy.move('right');
      break;
    case 'ArrowLeft':
      goodGuy.move('left');
      break;
    case 'ArrowUp':
      goodGuy.move('up');
      break;
    case 'ArrowDown':
      goodGuy.move('down');
      break;
      
  }


}