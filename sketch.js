var trex, trex_running, trex_collide, edges, gameOver, restart, gameOverImage, restartImage;
var jumpSound, dieSound, checkSound;
var groundImage;
var tick = 5;
var score = 0;
var gameState = "PLAY";

var cloudsGroup;
var enemyGroup;

function preload(){
  //Images
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collide = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  enemy1Image = loadImage("obstacle1.png");
  enemy2Image = loadImage("obstacle2.png");
  enemy3Image = loadImage("obstacle3.png");
  enemy4Image = loadImage("obstacle4.png");
  enemy5Image = loadImage("obstacle5.png");
  enemy6Image = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  //Sound
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkSound = loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  ground = createSprite(50,180,1100,10);
  ground.addImage("ground", groundImage);
    
  fakeGround = createSprite(50,195,1100,10);
  
  //crea el Trex
  trex = createSprite(50,165,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trex_collide);
  edges = createEdgeSprites();
  
  gameOver = createSprite(600 / 2, 200 / 2 - 20, 50, 20);
  gameOver.addImage("GameOver", gameOverImage);
  gameOver.visible = false;
  
  restart = createSprite(600 / 2, 200 / 2 + 20, 30, 10);
  restart.addImage("Restart", restartImage);
  restart.scale = 0.6;
  restart.visible = false;
  
  //añade escala y posición al Trex
  trex.scale = 0.5;
  trex.x = 50;
  fakeGround.visible = false;
  enemyGroup = new Group();
  cloudsGroup = new Group();
}

function draw(){
  background("white");
  
  trex.debug = false;
  trex.setCollider("rectangle", 0, 0, trex.width * 2, trex.height * 2);
  
  //SCORE
  textSize(25);
  text("Score: " + score, 10, 30);
  
  //PLAY
  if(gameState === "PLAY"){
    //Ground Velocity
    ground.velocityX = -(2 + score / 200) * 3;
    
    if(ground.velocityX < -10) ground.velocityX + 3;
    console.log(ground.velocityX);
    
    //Score
    score += Math.round(getFrameRate() / 50);
    
    //Ground spawn
    if(ground.x < 0) {
      ground.x = 1100;
    }
    
    if(score > 399 && score % 1000 === 0){
      checkSound.play();
    }
    
    //Key Listeners
    if(trex.y >= 160 && (keyDown("up") || keyDown("space"))){
      trex.velocityY = -20;
    }
    trex.velocityY = trex.velocityY + 1.8;
    
    spawnClouds();
    spawnEnemy();
    
    if(enemyGroup.isTouching(trex)) {
      gameState = "END";
      //Sound
      dieSound.play();
    }
    trex.collide(fakeGround)
    fakeGround.visible = false;
    
     }else if(gameState === "END"){
       ground.velocityX = 0;
       trex.changeAnimation("collide", trex_collide);
       
       cloudsGroup.setVelocityXEach(0);
       enemyGroup.setVelocityXEach(0);
       cloudsGroup.setLifetimeEach(-1);
       enemyGroup.setLifetimeEach(-1);
       
       trex.collide(fakeGround)
       
       //trex.y = 166;
       trex.velocityY = trex.velocityY + 1.5;
       
       //Images
       gameOver.visible = true;
       restart.visible = true;
       
       if(mousePressedOver(restart)){
     reset();
     }
     }
  
  console.log(getFrameRate());
  
  drawSprites();
}

function Sound(){
  if((keyDown("up") || keyDown("space"))){
      jumpSound.play();
    }
}

function spawnClouds(){
  if(frameCount % 30 === 0) {
    clouds = createSprite(600, 50, 30, 30);
    clouds.addImage("cloud", cloudImage);
    clouds.scale = 0.8
    clouds.velocityX = -10;
    clouds.y = Math.round(random(50, 80));
    //console.log("Clouds: ", clouds.depth);
    trex.depth = clouds.depth + 1;
    
    clouds.lifetime = 65;
    
    cloudsGroup.add(clouds);
  }
}

function spawnEnemy(){
  if(frameCount % 60 === Math.round(random(1, 0))){
    var enemy = createSprite(600, 10, 10, 10);
    rand = Math.round(random(1, 6));
    switch (rand){
      case 1: enemy.addImage(enemy1Image);
        break;
      case 2: enemy.addImage(enemy2Image);
        break;
      case 3: enemy.addImage(enemy3Image);
        break;
      case 4: enemy.addImage(enemy4Image);
        break;
      case 5: enemy.addImage(enemy5Image);
        break;
      case 6: enemy.addImage(enemy6Image);
        break;
      default:
        break;
    }
    
    enemy.lifetime = 100
    enemy.velocityX = -(3 + score / 200) * 3;
    enemy.scale = 0.5;
    enemy.y = 160
    
    enemyGroup.add(enemy);
  }
}

function reset(){
  gameState = "PLAY";
  
  gameOver.visible = false;
  restart.visible = false;
  
  enemyGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
}