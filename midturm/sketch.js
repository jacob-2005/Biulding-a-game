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
let characterMoveNewDirection;
let lookingDirection  = null;
let chamber;
let chamberNewX1;
let chamberNewX2;
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
    this.x2 = x2 + this.paddingHorizontal;
    this.y1 = y1 - this.paddingVertical;
    this.y2 = y2 + this.paddingVertical;
  }
  setWidth(characterWidth){
    if (this.isHorizontal){
      this.width = this.x2 - this.x1;
    }else{
      this.width = characterWidth + this.paddingHorizontal * 2;
    }
  }
  setHeight(characterHeight){
    if (this.isVertical){
      this.height = this.y2 - this.y1;
    }else{
      this.height = characterHeight + this.paddingVertical * 2;
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
  draw (){
    const [x1, y1, x2, y2] = this.coords;
    fill('black');
    noStroke();
    
      rect(x1, y1, x2-x1, this.height);
      rect(x1, y1, this.width, y2-y1);
  }

}
class Character {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  fill = color(255, 255, 0);
  velocity = 3;
  currentPath = null;
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
  move(){
    let newY = this.y;
    let newX = this.x;
    // if(this.tryToSwitchPaths()){
    //   return;
    // }
    if(characterMoveDirection == null){
      return;
    }
    if (this.currentPath.isHorizontal && (characterMoveDirection == 'up' || characterMoveDirection == 'down')){

    }else if (this.currentPath.isVertical && (characterMoveDirection == 'left' || characterMoveDirection == 'right')){

    }else{
      switch(characterMoveDirection){
        case 'up': 
          newY += this.velocity;
          lookingDirection = PI + HALF_PI;
          break;
        case 'down':
          newY -= this.velocity;
          lookingDirection = HALF_PI;
          break;
        case 'left':
          newX -= this.velocity;
          lookingDirection = PI;
          break;
        case 'right':
          newX += this.velocity;
          lookingDirection = TWO_PI;
          break;
      }
      if(!this.pathCollisionDetected(newY, newX)){
        this.x = newX;
        this.y = newY;
      }
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
    });
  }
  // tryToSwitchPaths(){
  //   let newX = this.x;
  //   let newY = this.y;
  //   if(characterMoveNewDirection === 'up'){
  //     newY = characterMoveNewDirection - this.velocity;
  //   }else if (characterMoveNewDirection === 'down'){
  //     newY = characterMoveNewDirection + this.velocity;
  //   }else if (characterMoveNewDirection === 'left'){
  //     newX = characterMoveNewDirection - this.velocity;
  //   }else if (characterMoveNewDirection === 'right'){
  //     newX = characterMoveNewDirection + this.velocity;
  //   }
  //   connectedPath = this.getConnectedPathTouchingPoint(newX, newY);
  //   if(!connectedPath){
  //     return
  //   }
  //   this.currentPath = connectedPath;
  //   characterMoveDirection = characterMoveNewDirection;
  //   characterMoveNewDirection = null;
  // }
}

class BadGuy extends Character {
  fill = color('red');
  goodGuy = null;
  setGoodGuy(goodGuy){
    this.goodGuy = goodGuy;
  }
  followGoodGuy(){
    const [newX, newY] = followPoint(this.x, this.y, this.goodGuy.x, this.goodGuy.y, this.velocity)

    this.x = newX;
    this.y = newY;
  }
  move(){
    this.followGoodGuy();
  }
}
class PacManCharacter extends Character {

}
class Chamber {
  x = 340;
  y = 100;
  width = 120;
  height = 60;
  touchingPath = null;
  centerOfChamberX = null;
  constructor(x, y, width, height, touchingPath, centerOfChamberX) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.touchingPath = touchingPath; 
    this.centerOfChamberX = (x + (width/2));
    this.draw(centerOfChamberX, x, y, width, height);
  }
  draw(centerOfChamberX, x, y, width, height) {
    fill(0);
    rect(x, y, width, height);

    let chamberDoorX1 = (x + (centerOfChamberX /2));
    let chamberNewX2 = ((x + width) - (centerOfChamberX/2));

     rect(chamberDoorX1, y, chamberNewX2, y);
  }
}
let goodGuy;
let characterMoveDirection = 'right';
let badGuys = [];
const paths = [];

function pauseGame(){
  if(isPaused){
    characterMoveNewDirection = null;
    isPaused = false;
    loop();
  } else {
    isPaused = true;
    noLoop();
  }
}
function keyPressed(e){
  if(e.key == "Escape"){
    pauseGame();
    }
  if(characterMoveDirection === 'left' && key === 'ArrowRight'){
    characterMoveDirection = 'right';
  }else if(characterMoveDirection === 'right' && key === 'ArrowLeft'){
    characterMoveDirection = 'left';
    characterMoveNewDirection = null;
  }else if(characterMoveDirection === 'down' && key === 'ArrowUp'){
    characterMoveDirection = 'up';
    characterMoveNewDirection = null;
  }else if(characterMoveDirection === 'up' && key === 'ArrowDown'){
    characterMoveDirection = 'down';
  }else if(characterMoveDirection === 'right' && key === 'ArrowUp'){
    characterMoveNewDirection = null;
  }

  if(characterMoveDirection === 'left' && key === 'ArrowUp'){
    characterMoveNewDirection = 'up';
  }else if(characterMoveDirection === 'left' && key === 'ArrowDown'){
    characterMoveNewDirection = 'down';
    characterMoveNewDirection = 'up';
  }else if(characterMoveDirection === 'right' && key === 'ArrowDown'){
    characterMoveNewDirection = 'down';
  }else if(characterMoveDirection === 'up' && key === 'ArrowLeft'){
    characterMoveNewDirection = 'left';
  }else if(characterMoveDirection === 'up' && key === 'ArrowRight'){
    characterMoveNewDirection = 'right';
  }else if(characterMoveDirection === 'down' && key === 'ArrowLeft'){
    characterMoveNewDirection = 'left';
  }else if(characterMoveDirection === 'down' && key === 'ArrowRight'){
    characterMoveNewDirection = 'right';
  }
  if(characterMoveDirection === null){
    characterMoveDirection = characterMoveNewDirection;
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
  createCanvas(800, 500);
  rectMode(CORNER);
  createPathsAndRelationships();
  goodGuy = new PacManCharacter(200, 20, characterWidth, characterHeight, paths[0]);

  badGuys[0] = new BadGuy(20, 200, characterWidth, characterHeight,paths[1]);

  badGuys.forEach((badGuy, i) => {
    badGuy.setGoodGuy(goodGuy);
  });

}

function draw() {
  background(180, 180, 255);
  paths.forEach((path, i) => {
    path.draw();
  });

  goodGuy.draw();
  goodGuy.move();

  badGuys.forEach((badGuy, i) => {
    badGuy.move();
    badGuy.draw();
  });  

}