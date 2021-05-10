const PLAY = 1;
const END = 0;
var gameState = PLAY;

var naruto, naruto_running;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var  Obstacle, ObstaclesGroup, Obstacle1, Obstacle2, Obstacle3;

var score;
var gameOverImg, restartImg;


function preload(){
    naruto_running = loadAnimation("naruto.png");
    groundImage = loadImage("ground.png");
    cloudImage = loadImage("cloud.png");
    Obstacle1 = loadImage("Obstacle1.png");
    Obstacle2 = loadImage("Obstacle2.png");
    Obstacle3 = loadImage("Obstacle3.png");
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
}

function setup() {
  createCanvas(600, 250);
  naruto = createSprite(50,160,20,50);
  naruto.addAnimation("running", naruto_running);
  naruto.scale = 0.5;
  
  ground = createSprite(200,220,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.2;
  restart.scale = 0.09;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  ObstaclesGroup = new Group();
  cloudsGroup = new Group();

  
  naruto.setCollider("rectangle",0,0,naruto.width,naruto.height);
  naruto.debug = true;
  score = 0;
  
}

function draw() {
  background(180);
  text("Score: "+ score, 500,50);

  if(gameState === PLAY){

    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
  }
   if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& naruto.y >= 100) {
        naruto.velocityY = -12;
    }
  naruto.velocityY = naruto.velocityY + 0.8;
  
  spawnClouds();
  spawnObstacles();
   
    if(ObstaclesGroup.isTouching(naruto)){
       gameState = END;
    }
  else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      ground.velocityX = 0;
      naruto.velocityY = 0

   ObstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     ObstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
     if(mousePressedOver(restart)) {
      reset();
    }
   }
naruto.collide(invisibleGround);
  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  ObstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  naruto.changeAnimation("running",naruto_running);
  score=0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   Obstacle = createSprite(600,165,10,40);
   Obstacle.velocityX = -(6 + score/100);
 
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: Obstacle.addImage(Obstacle1);
              break;
      case 2: Obstacle.addImage(Obstacle2);
              break;
      case 3: Obstacle.addImage(Obstacle3);
              break;
    }

     Obstacle.scale = 0.17;
    Obstacle.lifetime = 300;
    ObstaclesGroup.add(Obstacle);
}
}

function spawnClouds() {
 
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    cloud.lifetime = 200;
    cloud.depth = naruto.depth;
    naruto.depth = naruto.depth + 1;
    cloudsGroup.add(cloud);
  }
}