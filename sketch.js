const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope, fruit, ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button, blower;
var bunny;
var blink, eat, sad;
var mute_btn, mute_img;

var fr, rope2;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;
var isMobile;

function preload() {
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}


function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    createCanvas(displayWidth, displayHeight);
  } else {
    createCanvas(windowWidth, windowHeight);
  }

  frameRate(80);

  bk_song.loop();

  engine = Engine.create();
  world = engine.world;

  button = createImg('cut_btn.png');
  button.position(220, 30);
  button.size(50, 50);
  button.mouseClicked(drop);


  rope = new Rope(7, { x: 245, y: 30 });
  ground = new Ground(200, 690, 600, 20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(350, 620, 100, 100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking', blink);
  bunny.addAnimation('eating', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking');

  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)

  blower = createImg('balloon.png');
  blower.position(80, 230);
  blower.size(140, 100);
  blower.mouseClicked(blow)

  mute_img = "<img src='mute.png' width='50vw'/>"
  mute_btn = createButton(mute_img)
  mute_btn.position(420, 0)
  bk_song.setVolume(0.1);
  air.setVolume(0.1)
  cut_sound.setVolume(0.7)
  eating_sound.setVolume(0.7)
  alert("Mobile: "+isMobile+" Height: "+displayHeight+" Width: "+displayWidth)
}

function draw() {
  mute_btn.mouseClicked(toggleMute)
  background(51);
  // if (isMobile) {
  //881*397
  /*if (displayHeight*700 > displayWidth*500) {
    image(bg_img, 0, 0, displayWidth, displayWidth/500*690);
  } else {
  image(bg_img, 0, 0, displayHeight/690*500, displayHeight);
  }
  } else {*/
    if (windowHeight*700 > windowWidth*500) {
      image(bg_img, 0, 0, windowWidth, windowWidth/500*700);
    } else {
      image(bg_img, 0, 0, windowHeight/700*500, windowHeight);
    }
  //}

  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  rope.show();
  Engine.update(engine);
  ground.show();

  drawSprites();

  if (collide(fruit, bunny) == true) {
    bunny.changeAnimation('eating');
    eating_sound.play()
  }


  if (fruit != null && fruit.position.y >= 650) {
    bunny.changeAnimation('crying');
    sad_sound.play()
    fruit = null;
  }
}

function toggleMute() {
  if (bk_song.isPlaying()) {
    bk_song.pause();
    air.setVolume(0)
    eating_sound.setVolume(0)
    cut_sound.setVolume(0)
    sad_sound.setVolume(0)
  } else {
    bk_song.play();
    air.setVolume(0.1)
    eating_sound.setVolume(0.7)
    cut_sound.setVolume(0.7)
    sad_sound.setVolume(1)
  }
}

function drop() {
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function blow() {
  Body.applyForce(fruit, { x: 220, y: 330 }, { x: 0.06, y: 0 })
  air.play()
}


function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    }
    else {
      return false;
    }
  }
}


