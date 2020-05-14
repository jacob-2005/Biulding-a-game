const characterHeight = 15;
const characterWidth = 15;
const pathCoords = [
  [20, 20, 760, 20],
  [20, 20, 20, 80],
  [20, 80, 60, 80],
  [60, 20, 60, 260],
  [100, 20, 100, 260],
  [100, 80, 240, 80],
  [240, 80, 240, 260],
  [100, 140, 180, 140],
  [180, 140, 180, 260],
  [280, 80, 280, 260],
  [280, 80, 500, 80],
  [500, 80, 500, 260],
  [280, 200, 500, 200],
  [380, 20, 380, 80],
  [560, 20, 560, 260],
  [560, 140, 760, 140],
  [660, 20, 660, 260],
  [760, 20, 760, 260],
  [20, 260, 760, 260],];

let chamber;
let chamberNewX1;
let chamberNewX2;

let mouthCount;
let increaseMouthCount;
let direction = -1;
const FRAME_RATE = 60;
let lookingDirection = 0;
const bottomJawArc = mouthCount + lookingDirection; 
const topJawArc = -mouthCount + lookingDirection;

let pacMan1X = 50;
let pacMan1Y = 50;
const pacManWidth = 15;

const SPACE_BETWEEN_FOOD = 10;
const allFood = [];
let totalFoodEaten = 0;

function followPoint(startingX, startingY, endingX, endingY, velosity) {
  const deltaY = endingY - startingY;
  const deltaX = endingX - startingX;
  const angle = atan2(deltaY, deltaX);
  const distanceBetween = dist(startingX, startingY, endingX, endingY);

  let totalDistanceToTraval = distanceBetween;
  if(totalDistanceToTraval > velosity) {
    totalDistanceToTraval = velosity;
  }

  const distanceToTravalX = cos(angle) * totalDistanceToTraval;
  const distanceToTravalY = sin(angle) * totalDistanceToTraval;

  const newX = startingX + distanceToTravalX;
  const newY = startingY + distanceToTravalY;

  return [newX, newY];
}
let isPaused = false;
let isOver = false;

class Path {
  coords = null;
  connections = [];
  isVertical = false;
  isHorizontal = false;
  width = null;
  height = null;
  food = [];
  constructor (width, height, coords) {
    this.paddingVertical = height / 6;
    this.paddingHorizontal = width / 6;
    this.coords = coords;
    const [x1, y1, x2, y2] = coords;
    this.setOrientation(coords)
    this.setCoordintes(x1, y1, x2, y2);
    this.setWidth(characterWidth);
    this.setHeight(characterHeight);
  }
  setOrientation(coords){
    if(coords[0] === coords[2]){
      this.isVertical = true;
      this.isHorizontal = false;
    }else{
      this.isHorizontal = true;
      this.isVertical  = false;
    }
  }
  setCoordintes(x1, y1, x2, y2){
    this.x1 = x1 - this.paddingHorizontal;
    this.x2 = x2 - this.paddingHorizontal;
    this.y1 = y1 - this.paddingVertical;
    this.y2 = y2 + this.paddingVertical;
  }
  setWidth(characterWidth){
    const padding = this.paddingHorizontal * 2
    if (this.isHorizontal){
      this.width = this.x2 - this.x1 + (padding * 4);
    }else{
      this.width = characterWidth + (this.paddingHorizontal * 2);
    }
  }
  setHeight(characterHeight){
    if (this.isVertical){
      this.height = this.y2 - this.y1;
    }else{
      this.height = characterHeight + (this.paddingVertical * 2);
    }
  }
  addConnection(path) {
    this.connections.push(path);

  }
  isPointOnPath(x, y){
    const [x1, y1, x2, y2] = this.coords;
    if(this.isVertical){
      if(x != x1){
        return false;
      }
      if(y > y2){
        return false;
      }
      if(y < y1){
        return false;
      }
    }else if(this.isHorizontal){
      if(x > x2){
        return false;
      }
      if(x < x1){
        return false;
      }
      if(y != y1){
        return false;
      }
    }
    return true;
  }
  pathIntersetsWithPath(path){
    if (this.isVertical && path.isVertical){
      return false;
    }

    if (this.isHorizontal && path.isHorizontal){
      return false;
    }
    const [x11, y11, x12, y12] = this.coords;
    const [x21, y21, x22, y22] = path.coords;
    if(this.isVertical){
      if(x21 > x11){
        return false;
      }
      if(x22 < x12){
        return false;
      }
      if(y21 < y11){
        return false;
      }
      if(y22 > y12){
        return false;
      }
    }else if(this.isHorizontal){
      if(x21 < x11){
        return false;
      }
      if(x22 > x12){
        return false;
      }
      if(y21 > y11){
        return false;
      }
      if(y22 < y12){
        return false;
      }
    }
    return true;
  }
  setFood(){

  }
  tryToEatFood(characterX, characterY){

  }
  draw (){
    const [x1, y1, x2, y2] = this.coords;
    fill('black');
    noStroke();
    
    rect(x1, y1, this.width, this.height);
  }

}
class Character {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  fill = color(255, 255, 0);
  velocity = 4;
  currentPath = null;
  direction = null;
  characterMoveNewDirection = null;
  constructor(x, y, width, height, path, coords){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.currentPath = path;
  }
  draw(){
    fill(this.fill)
    ellipse(this.x + (this.width/2), this.y + (this.height/2), this.width, this.height)
  }
  getConnectedPath(){
    return this.getConnectedPathTouchingPoint(this.x, this.y);
  }
  tryToMove(direction){
    let newY = this.y;
    let newX = this.x;

    if(direction == null){
      return;
    }
    if (this.currentPath.isHorizontal && (this.characterMoveNewDirection == 'up' || this.characterMoveNewDirection == 'down')){
      this.tryToSwitchPaths();
    }else if (this.currentPath.isVertical && (this.characterMoveNewDirection == 'left' || this.characterMoveNewDirection == 'right')){
      this.tryToSwitchPaths();
    }
    switch(direction){
      case 'up': 
        newY -= this.velocity;
        break;
      case 'down':
        newY += this.velocity;
        break;
      case 'left':
        newX -= this.velocity;
        break;
      case 'right':
        newX += this.velocity;
        break;
    }
    if(!this.pathCollisionDetected(newY, newX)){
      this.x = newX;
      this.y = newY;
    }else if(this.canSwitchAnyPath){
      this.tryToSwitchPaths();
    }
    
  }

  pathCollisionDetected(newY, newX){
    if(newY > this.currentPath.coords[3]){
      return true;
    }
    if(newY < this.currentPath.coords[1]){
      return true;
    }
    if(newX > this.currentPath.coords[2]){
      return true;
    }
    if(newX < this.currentPath.coords[0]){
      return true;
    }
    return false;
  }
  getConnectedPathTouchingPoint(x, y){
    return this.currentPath.connections.filter(path =>{
      return path.isPointOnPath(x, y);
    })[0];
  }
  tryToSwitchPaths(){
    let newX = this.x;
    let newY = this.y;
    if(this.characterMoveNewDirection === 'up'){
      newY = this.y - this.velocity;
    }else if (this.characterMoveNewDirection === 'down'){
      newY = this.y + this.velocity;
    }else if (this.characterMoveNewDirection === 'left'){
      newX = this.x - this.velocity;
    }else if (this.characterMoveNewDirection === 'right'){
      newX = this.x + this.velocity;
    }
    const connectedPath = this.getConnectedPathTouchingPoint(newX, newY);
    if(!connectedPath){
      return
    }
    this.currentPath = connectedPath;
    this.direction = this.characterMoveNewDirection;
    this.characterMoveNewDirection = null;
  }
}
class PacManPlayer extends Character {
  fill = color('yellow');
  draw(){
    fill(this.fill);
    mouthCount += direction * increaseMouthCount;
    const bottomJawArc = mouthCount + lookingDirection; 
    const topJawArc = -mouthCount + lookingDirection;
  
    if (frameCount % (FRAME_RATE / 2) === 0) {
      direction = direction * -1;
    }
    arc(this.x + (this.width/2), this.y + (this.height/2), characterWidth, characterHeight, bottomJawArc, topJawArc, PIE);
  
  }
  move(){
    this.tryToMove(this.direction);
    this.mouthMove()
  }
  mouthMove(){
    switch(this.direction){
      case 'up': 
        lookingDirection = PI + HALF_PI;
        break;
      case 'down':
        lookingDirection = HALF_PI;
        break;
      case 'left':
        lookingDirection = PI;
        break;
      case 'right':
        lookingDirection = TWO_PI;
        break;
    }
  }
}
class BadGuy extends Character {
  fill = color('red');
  goodGuy = null;
  direction = 'down';
  canSwitchAnyPath = true;
  isFollowingGoodGuy = false;
  setGoodGuy(goodGuy){
    this.goodGuy = goodGuy;
  }
  DIGDUGfollowGoodGuy(){
    const [newX, newY] = followPoint(this.x, this.y, this.goodGuy.x, this.goodGuy.y, this.velocity)

    this.x = newX;
    this.y = newY;
  }
  tryToFollowGoodGuy(){
    this.switchPathsTofollowGoodGuy();
    if(this.goodGuy.currentPath === this.currentPath){
      this.isFollowingGoodGuy = true;
      return
    }
    if(this.goodGuy.getConnectedPath() === this.currentPath){
      this.isFollowingGoodGuy = true;
    }
  }
  isGoodGuyOnBadGuysConnectedPath(){
    if(this.goodGuy.currentPath === this.currentPath){
      return true;
    }
    if(this.goodGuy.getConnectedPath() === this.currentPath){
      return true;
    }
    return false;
  }
  turnToGoodGuyOnSamePath(){
    if(!this.isGoodGuyOnBadGuysConnectedPath()){
      return
    }
    if(this.currentPath.isHorizontal && this.x < this.goodGuy.x){
      this.direction = 'right';
      return;
    }
    if(this.currentPath.isHorizontal && this.x > this.goodGuy.x){
      this.direction = 'left';
      return;
    }
    if(this.currentPath.isVertical && this.y > this.goodGuy.y){
      this.direction = 'up';
      return;
    }
    if(this.currentPath.isVertical && this.y < this.goodGuy.y){
      this.direction = 'down';
      return;
    }
  }
  switchPathsTofollowGoodGuy(){
    if(this.goodGuy.currentPath === this.currentPath){
      return
    }
    const connectedPath = this.getConnectedPathTouchingPoint(this.x, this.y);
    if(!connectedPath){
      return;
    }
    if(connectedPath === this.goodGuy.currentPath){
      this.currentPath = connectedPath;
    }
  }
  turnToGoodGuy(){
    this.switchPathsTofollowGoodGuy();
    this.turnToGoodGuyOnSamePath();
    if(!this.isGoodGuyOnBadGuysConnectedPath()){
      this.isFollowingGoodGuy = false;
    }
  }
  tryToRandomlySwitchPaths(){
    if(this.isFollowingGoodGuy){
      return;
    }
    if(random() < 0.2){
      this.tryToSwitchPaths(false);
    }
  }
  detectCollitionWithGoodGuy(){
    let disanceFromGoodGuy = dist(this.x, this.y, this.goodGuy.x, this.goodGuy.y);
    if(disanceFromGoodGuy < characterWidth){
      gameOver();
      fill(255, 0, 0)
      textSize(32)
      text('Game Over', 320, 150)
      text('You lose', 345, 190)
    }
  }
  move(){
    this.detectCollitionWithGoodGuy();
    if(!this.isFollowingGoodGuy){
      this.tryToFollowGoodGuy();
    }
    if(this.isFollowingGoodGuy){
      this.turnToGoodGuy();
    }
    this.tryToRandomlySwitchPaths();
    this.tryToMove(this.direction);
  }
  getConnectedPathTouchingPoint(x, y){
    return this.currentPath.connections.filter(path =>{
      return path.isPointOnPath(x, y);
    })[0];
  }
  setRandomDirection(){
    const randomNumber = random(0, 1);

    if(this.currentPath.isHorizontal){
      if(randomNumber < 0.5){
        this.direction = 'left';
      }else{
        this.direction = 'right';
      }
    }else if(this.currentPath.isVertical){
      if(randomNumber < 0.5){
        this.direction = 'up';
      }else{
        this.direction = 'down';
      }
    }
  }
  canGoUp(){
    if(this.currentPath.isVertical){
      if(this.y > this.currentPath.coords[1]){
        return true;
      }
    }
    return false;
  }
  canGoDown(){
    if(this.currentPath.isVertical){
      if(this.y < this.currentPath.coords[3]){
        return true;
      }
    }
    return false;
  }
  
  canGoLeft(){
    if(this.currentPath.isHorizontal){
      if(this.x > this.currentPath.coords[0]){
        return true;
      }
    }
    return false;
  }
  canGoRight(){
    if(this.currentPath.isHorizontal){
      if(this.x < this.currentPath.coords[2]){
        return true;
      }
    }
    return false;
  }
  reverse(){
    switch(this.direction){
      case 'left':
        return 'right';
      case 'right':
        return 'left';
      case 'up':
        return 'down';
      case 'down':
        return 'up';
    }
  }
  tryToSwitchPaths(shouldReverse = true){
    const connectedPath = this.getConnectedPathTouchingPoint(this.x, this.y);
    if(!connectedPath && !shouldReverse){
      return
    }
    if(!connectedPath){
      this.direction = this.reverse();
      return;
    }
    this.currentPath = connectedPath;
    if(this.canGoRight() && this.canGoLeft()){
      this.setRandomDirection();
      return;
    }
    if(this.canGoUp() && this.canGoDown()){
      this.setRandomDirection();
      return;
    }
    if(this.canGoRight()){
      this.direction = 'right';
      return;
    }
    if(this.canGoLeft()){
      this.direction = 'left';
      return;
    }
    if(this.canGoUp()){
      this.direction = 'up';
      return;
    }
    if(this.canGoDown()){
      this.direction = 'down';
      return;
    }
    throw new Error('imposable direction for BadGuy');
  }
}
// function getAlreadyExistingFood(x, y){
//   for(let i = 0; i < 425; i++){
//     allFood;
//   }
//   return food;
// }
// function 
// class Food {
//   isEaten = false;
//   x = null;
//   y = null;
//   constructor(x, y){
//     this.x = x;
//     this.y = y;
//     this.isEaten = isEaten;
//   }
//   draw(){
//     stroke(255, 255 ,0)
//     strokeWaight(5);
//     point(this.x, this.y);
//   }
// }
class Chamber {
  x = 340;
  y = 100;
  width = 120;
  height = 60;
  touchingPath = null;
  centerOfChamberX = null;
  chamberDoorX1 = null;
  chamberNewX2 = null;
  constructor(x, y, width, height, touchingPath, centerOfChamberX) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.touchingPath = touchingPath; 
    this.centerOfChamberX = (x + (width/2));
    this.chamberDoorX1 = (this.x + (this.centerOfChamberX /2));
    this.chamberNewX2 = ((this.x + this.width) - (this.centerOfChamberX/2));
    this.draw(centerOfChamberX, x, y, width, height);
  }
  draw(centerOfChamberX, x, y, width, height) {
    fill(0);
    rect(x, y, width, height);



    rect(this.chamberDoorX1, y, this.chamberNewX2, 105);
  }
}
let goodGuy;
let badGuys = [];
const paths = [];

function pauseGame(){
  if(isPaused){
    goodGuy.characterMoveNewDirection = null;
    isPaused = false;
    loop();
  } else {
    isPaused = true;
    noLoop();
  }
}
function gameOver(){
  if(isOver){
    goodGuy.characterMoveNewDirection = null;
    isOver = false;
    isPaused = false
    loop();

  } else {
    isOver = true;
    noLoop();
  }
}
function keyPressed(e){
  if(e.key == "Escape"){
    pauseGame();
    }
  switch(e.key){
    case 'ArrowRight':
      if(goodGuy.direction === 'left'){
        goodGuy.direction = 'right';
      }else{
        goodGuy.characterMoveNewDirection = 'right';
      }
      break;
    case 'ArrowLeft':
      if(goodGuy.direction === 'right'){
        goodGuy.direction = 'left';
      }else{
        goodGuy.characterMoveNewDirection = 'left';
      }
      break;
    case 'ArrowUp':
      if(goodGuy.direction === 'down'){
        goodGuy.direction = 'up';
      }else{
        goodGuy.characterMoveNewDirection = 'up';
      }
      break;
    case 'ArrowDown':
      if(goodGuy.direction === 'up'){
        goodGuy.direction = 'down';
      }else{
        goodGuy.characterMoveNewDirection = 'down';
      }
      break;
      
  }

  if(goodGuy.direction === null){
    goodGuy.direction = goodGuy.characterMoveNewDirection;
  }
}
function createPathsAndRelationships(){
  pathCoords.forEach((pathCoord, i)=> {
    paths[i] = new Path(characterWidth, characterHeight, pathCoords[i]);
  });
  paths.forEach((path)=>{
    const pathIntersections = paths.filter((otherPath)=>{
      if(path === otherPath){
        return false;
      }
      return path.pathIntersetsWithPath(otherPath);
    });
    pathIntersections.forEach(otherPath =>{
      path.addConnection(otherPath);
    });
  });
}
function connectPaths(path1, path2){
  addConnection(path1, path2);
}
function setup() {
  mouthCount = QUARTER_PI;
  increaseMouthCount = QUARTER_PI/FRAME_RATE * 2;
  createCanvas(800, 500);
  rectMode(CORNER);
  createPathsAndRelationships();
  chamber = new Chamber(340, 100, 120, 60)
  goodGuy = new PacManPlayer(200, 20, characterWidth, characterHeight, paths[0]);

  badGuys[0] = new BadGuy(20, 40, characterWidth, characterHeight,paths[1]);

  badGuys.forEach((badGuy, i) => {
    badGuy.setGoodGuy(goodGuy);
  });
  frameRate(FRAME_RATE)
}

function draw() {
  background(180, 180, 255);
  paths.forEach((path, i) => {
    path.draw();
  });
  chamber.draw();
  
  goodGuy.draw();
  goodGuy.move();

  badGuys.forEach((badGuy, i) => {
    badGuy.move();
    badGuy.draw();
  });  

}