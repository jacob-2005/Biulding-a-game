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
  [100, 140, 240, 140],
  [180, 140, 180, 260],
  [280, 80, 280, 260],
  [280, 80, 500, 80],
  [500, 80, 500, 260],
  [280, 200, 500, 200],
  [380, 20, 380, 80],
  [560, 20, 560, 260],
  [500, 140, 760, 140],
  [660, 20, 660, 260],
  [760, 20, 760, 260],
  [20, 260, 760, 260],
  [240, 120, 280, 120]];

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
    this.setOrientation(coords);
    this.setCoordintes(x1, y1, x2, y2);
    this.setWidth(characterWidth);
    this.setHeight(characterHeight);
    this.setFood();
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
    if(characterX === this.x && characterY === this.y){
      isEaten = true;
      totalFoodEaten += 1;
    }
  }
  drawFood(){
    let foodX = null;
    if(this.isEaten === true){
      return
    }
    if(goodGuy.currentPath.isHorizontal){
      for(let foodX = this.x1; foodX > this.x2; foodX + SPACE_BETWEEN_FOOD){
        point(foodX, this.y1)
      }

    }
  }
  draw (){
    const [x1, y1, x2, y2] = this.coords;
    fill('black');
    noStroke();
    
    rect(x1, y1, this.width, this.height);
    this.drawFood();
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
  constructor(x, y, width, height, path, fill, coords){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.currentPath = path;
    this.fill = fill;
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
    if(random() < 0.01){
      this.direction = this.reverse();
    }
  }
  detectCollitionWithGoodGuy(){
    let disanceFromGoodGuy = dist(this.x, this.y, this.goodGuy.x, this.goodGuy.y);
    if(disanceFromGoodGuy < characterWidth){
      gameOver();
      fill(255)
      textSize(100)
      text('Game Over', 120, 150)
      text('You lose', 195, 250)
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
function returnExistingFood(x, y){
  for(let i = 0; i < 425; i++){
    allFood;
  }

  return true;
}
function setNewFood(food){
  allFood = [food]
}
class Food {
  isEaten = false;
  x = null;
  y = null;
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.isEaten = isEaten;
  }
  draw(){
    stroke(255, 255 ,0)
    strokeWaight(5);
    point(this.x, this.y);
  }
}
function youWin(){
  if(totalFoodEaten === 425){
    gameOver();
    fill(255)
    textSize(100)
    text('YOU WIN!', 145, 190);
 }
}
class Chamber {
  x = 340;
  y = 100;
  width = 120;
  height = 60;
  touchingPath = null;
  centerOfChamberX = null;
  ghosts = [];
  indexOfGhostCurentlyEjecting = -1;
  velocityOfGhost = 4
  isEjected = false
  doorY = 101
  constructor(x, y, width, height, touchingPath, centerOfChamberX) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.touchingPath = touchingPath;
    centerOfChamberX = (this.x + (this.width/2)); 
    this.centerOfChamberX = centerOfChamberX;
    this.draw();
  }
  addGhost(badGuy){
    this.ghosts.push(badGuy)
  }
  connectToNearestPath(){
    this.touchingPath = paths[11];
  }
  tryToEjectGhost(){
    if(frameCount === 0){
      return;
    }
    if(frameCount % 300 === 0){
      this.indexOfGhostCurentlyEjecting += 1;
      this.isEjected = false
    }
    if(this.indexOfGhostCurentlyEjecting === -1 || this.indexOfGhostCurentlyEjecting >= this.ghosts.length){
      return;
    }
    if(this.isEjected === false){
      this.moveToDoor()
    }
  }
  moveToDoor(){
    const badGuy = this.ghosts[this.indexOfGhostCurentlyEjecting];
    const [newX, newY] = followPoint(badGuy.x, badGuy.y, 400, 80, this.velocityOfGhost);
    if(BadGuy.y < this.doorY){
      return
    }
    badGuy.y = newY;
    badGuy.x = newX;
    if(badGuy.y === 80 ){
      badGuy.currentPath = paths[11];
      this.isEjected = true
      return 
    }
  }
  draw() {
    fill(0);
    rect(this.x, this.y, this.width, this.height);
    stroke(253, 190, 190)
    line(380, 101, 420, 101)
    noStroke()
  }
}
let goodGuy;
let badGuys = [];
const paths = [];
let chambers = [];

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
  chamber = new Chamber(340, 102, 120, 60)
  goodGuy = new PacManPlayer(200, 20, characterWidth, characterHeight, paths[0], 'yellow');

  badGuys[0] = new BadGuy(400, 80, characterWidth, characterHeight,paths[11], 'red');
  badGuys[1] = new BadGuy(400, 144, characterWidth, characterHeight,paths[11], 'pink');
  badGuys[2] = new BadGuy(360, 144, characterWidth, characterHeight,paths[11], 'blue');
  badGuys[3] = new BadGuy(440, 144, characterWidth, characterHeight,paths[11], 'green');
  badGuys.forEach((badGuy, i) => {
    badGuy.setGoodGuy(goodGuy);
  });
  badGuys.slice(1).forEach(badGuy =>{
    chamber.addGhost(badGuy)
  })
  frameRate(FRAME_RATE)
}

function draw() {
  background(180, 180, 255);
  paths.forEach((path, i) => {
    path.draw();
    path.drawFood();
  });

  chamber.draw();
  chamber.tryToEjectGhost();

  goodGuy.draw();
  goodGuy.move();
  
  badGuys.forEach((badGuy, i) => {
    badGuy.move();
    badGuy.draw();
  });  
  youWin();
}