var bg, lawn;
var canvas;
var game, form, player;
var database, gameState, playerCount;
var allPlayers, zombie1, zombie1Img, zombie2, zombie2Img;
var hungerImg, food;
var powerFlower, obstacle1Image, obstacle2Image;
var flowers, foods;
var obstacles;
var zombies = [];
var ghost;

function preload(){
  bg = loadImage("assets/hauntedHouse.gif")
  lawn = loadImage("assets/grass1.png");
  zombie1Img = loadImage("assets/Zombie1.gif");
  zombie2Img = loadImage("assets/Zombie2.gif");
  hungerImg = loadImage("assets/hungerImage.jpg");
  food = loadImage("assets/chicken leg piece.jpg");
  powerFlower = loadImage("assets/flower1.gif");
  obstacle1Image = loadImage("assets/cherry.gif");
  obstacle2Image = loadImage("assets/apple.gif");
  ghost = loadImage("assets/ghost.gif");
}

function setup(){
canvas = createCanvas(windowWidth, windowHeight);

database = firebase.database();

game = new Game();
game.getState();
game.start();
}

function draw(){
  background(bg);
  if(playerCount === 2){
    game.updateState(1);
  }

  if(gameState === 1){
    game.play();
  }

}

function windowResized(){
resizeCanvas(windowWidth, windowHeight);
}