var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup,obstacle1;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("tile006.png","tile007.png","tile008.png","tile007.png");
  trex_collided = loadAnimation("tile007.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("rsz_cloudballs_1.png")
  
  obstacle1 = loadImage("icon_poo_16.png")
  
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  

  trex = createSprite(50,windowWidth - 250 ,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-80,width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,height/2 +50);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,40,trex.width,trex.height-80);
  
  score = 0;
  
}

function draw() {
  
  background(173,216,230);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    //move the 
    gameOver.visible = false;
    restart.visible = false;
    //change the trex animation
      trex.changeAnimation("running", trex_running);
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    console.log(trex.y);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
        trex.velocityY = -12;
        jumpSound.play();
             touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
       

     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);   
     
     if(mousePressedOver(restart)){
       reset();
     }
 
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  

  drawSprites();
}




function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height - 95,10,40);
   obstacle.velocityX = -(6 + score/100);
   
   obstacle.addImage(obstacle1);
      
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 2;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);

 }
}

function spawnClouds() {
  //write code here to spawn the clouds
 if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(10,140));
    cloud.addImage(cloudImage);
    cloud.scale = 2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset(){
  gameState = PLAY
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  trex.changeAnimation(trex_running);
  
}

