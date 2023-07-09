/*
global createCanvas, background, fill, text, width, height, rect, colorMode, HSB, key, keyPressed, constrain, keyCode, noStroke, random, collideRectRect, noLoop, loadImage, image, textSize, textFont, line, stroke, lerpColor, map, noFill, color, keyIsDown, createButton, DOWN_ARROW, ml5, backgroundImage 
*/
// function draw{
//   backgroundImage(introScreen)
// }
let dino, gameIsOver, button;
let countUp;
let cacti = [];
let birds = [];
let clouds = [];
let img,
  dino1,
  dino2,
  dino3,
  dino4,
  dino5,
  cloud,
  bird1,
  bird2,
  ground,
  introScreen;
let cactus_img;
let current;
let grad_color1, grad_color2;
// for machine learning
let soundClassifier;
//keeping track of ducking
let duck;
function preload() {
  const options = { probabilityThreshold: 0.95 };
  soundClassifier = ml5.soundClassifier("SpeechCommands18w", options);

  introScreen = loadImage(
    "https://cdn.glitch.com/b5b65d63-c3f9-49ee-ac86-fe9a54f48d4e%2FScreen%20Shot%202021-08-05%20at%209.22.19%20AM.png?v=1628169789025"
  );
  cactus_img = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2Fcacti.png?v=1627999750643"
  );
  dino1 = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2FIMG_2649.PNG?v=1627999927119"
  );
  dino2 = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2FIMG_2652.PNG?v=1628001818720"
  );
  dino3 = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2FIMG_2651.PNG?v=1628001343234"
  );

  dino4 = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2FIMG_2651.PNG?v=1628001343234"
  );
  dino5 = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2Fducking.png?v=1628085017340"
  );
  cloud = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2Fclooud.png?v=1628012577098"
  );

  bird1 = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2Fbird1.png?v=1628084368807"
  );
  bird2 = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2Fbird2.png?v=1628084368851"
  );
  ground = loadImage(
    "https://cdn.glitch.com/0389f836-98af-486b-9076-015cf22848e5%2Fground.png?v=1628017756161"
  );
}

document.body.style.background =
  "url('https://cdn.glitch.com/b5b65d63-c3f9-49ee-ac86-fe9a54f48d4e%2FScreen%20Shot%202021-08-05%20at%209.48.15%20AM.png?v=1628171306630')";

function setup() {
  createCanvas(600, 300);
  //backgroundImage(introScreen)
  dino = new Dinosaur();
  gameIsOver = false;
  countUp = 0;
  duck = false;
  button = createButton("Reset");
  button.mousePressed(resetGame);
  soundClassifier.classify(gotCommand);
}

function gotCommand(error, results) {
  if (error) {
    console.error(error);
  }
  console.log(results[0].label, results[0].confidence);
  if (results[0].label == "up") {
    dino.jump();
  }
  if (results[0].label == "down") {
    duck = true;
    dino.draw();
    duck = false;
  }
}

// Dino functionality
class Dinosaur {
  constructor() {
    // size of the dino
    this.s = 60;
    // position of the dino
    this.x = 60;
    this.y = height - this.s;
    // velocity
    this.v = 0;
    // gravity
    this.g = 0.5;
    this.current = dino1;
    this.image_counter = 0;
  }

  draw() {
    if (keyIsDown(DOWN_ARROW) || duck == true) {
      this.current = dino5;
      this.s = 30;
      this.y = height - this.s + 10;
    }
    this.s = 60;

    if (gameIsOver == true) {
      this.current = dino4;
      document.body.style.background =
        "url('https://cdn.glitch.com/b5b65d63-c3f9-49ee-ac86-fe9a54f48d4e%2FScreen%20Shot%202021-08-05%20at%209.52.41%20AM.png?v=1628171573756')";
    }
    image(this.current, this.x, this.y, this.s, this.s);
    this.image_counter++;
    if (this.image_counter == 20) {
      this.image_counter = 0;
      if (this.current === dino1) {
        this.current = dino2;
        this.image_counter++;
      } else {
        this.current = dino1;
        this.image_counter++;
      }
    }
  }

  jump() {
    // adding constraint: can only jump when at the bottom
    if (this.y == height - this.s) {
      this.v = -12;
    }
  }

  move() {
    this.y += this.v;
    this.v += this.g;
    // from p5.js reference --> constrain(number to constrain, low, high)
    this.y = constrain(this.y, 0, height - this.s);
  }

  hits(cactus) {
    return collideRectRect(
      this.x,
      this.y,
      this.s - 500,
      this.s - 500,
      cactus.x - 300,
      cactus.y - 500,
      cactus.s - 500,
      cactus.s - 500
    );
  }

  hits(bird) {
    return collideRectRect(
      this.x,
      this.y,
      this.s,
      this.s,
      bird.x,
      bird.y - 10,
      bird.s,
      bird.s
    );
  }
}

function keyPressed() {
  // if spacebar is pressed, make dino jump
  if (keyCode === 32) {
    dino.jump();
  }
  if (keyIsDown(DOWN_ARROW)) {
    dino.duck();
  }
}

//start the game over or play again
function resetGame() {
  countUp = 0;
}
// Obstacle functionality

class Cactus {
  constructor() {
    this.s = random(35, 40);
    this.x = width;
    this.y = height - this.s;
  }

  draw() {
    image(cactus_img, this.x, this.y, this.s - 20, this.s);
  }

  move() {
    this.x -= 3;
  }
}

class Bird {
  constructor() {
    this.s = 30;
    this.x = width;
    this.y = height - 83;
    this.current = bird1;
    this.image_counter = 0;
  }

  draw() {
    image(this.current, this.x, this.y, this.s, this.s);
    this.image_counter++;
    if (this.image_counter == 10) {
      this.image_counter = 0;
      if (this.current === bird1) {
        this.current = bird2;
        this.image_counter++;
      } else {
        this.current = bird1;
        this.image_counter++;
      }
    }
  }
  move() {
    this.x -= 3;
  }
}

class Cloud {
  constructor() {
    this.s = 60;
    this.x = width;
    this.y = random(height - 250, height - 300);
  }

  draw() {
    image(cloud, this.x, this.y, this.s, this.s);
  }
  move() {
    this.x -= 3;
  }
}

function draw() {
  colorMode(HSB, 360, 100, 100);
  var grad_color1 = color(210, 100, 100);
  var grad_color2 = color(170, 30, 100);
  setGradient(0, 0, 600, 300, grad_color1, grad_color2, "Y");
  dino.move();
  fill(255);
  textSize(20);
  textFont("monospace");

  //counter code
  text(`Score ${countUp}`, 470, 20);
  countUp++;

  image(ground, -15, 281, width + 30, 100);

  if (random(1) < 0.005) {
    clouds.push(new Cloud());
  }

  // random cacti on the canvas

  /*
  if (random(1) < 0.01) {
    if (random(1) < 0.5) {
      cacti.push(new Cactus());
    } else {
      birds.push(new Bird());
    }
  }
  */

  if (countUp == 100) {
    cacti.push(new Cactus());
  } else if (countUp == 200) {
    cacti.push(new Cactus());
  } else if (countUp == 300) {
    birds.push(new Bird());
  } else if (countUp == 400) {
    cacti.push(new Cactus());
  } else if (countUp == 500) {
    birds.push(new Bird());
  } else if (countUp == 600) {
    cacti.push(new Cactus());
  } else if (countUp == 700) {
    cacti.push(new Cactus());
  } else if (countUp == 800) {
    birds.push(new Bird());
  } else if (countUp == 900) {
    birds.push(new Bird());
  } else if (countUp == 1000) {
    cacti.push(new Cactus());
  } else if (countUp == 1100) {
    cacti.push(new Cactus());
  } else if (countUp == 1200) {
    cacti.push(new Cactus());
  } else if (countUp == 1300) {
    cacti.push(new Cactus());
  }else if (countUp == 1400) {
    birds.push(new Bird());
  }else if (countUp == 1500) {
    birds.push(new Bird());
  }

  for (let c of cacti) {
    c.move();
    // if the dinosaur hits the bird, game over
    if (dino.hits(c)) {
      text("Game is over!", 20, 20);
      gameIsOver = true;
      noLoop();
    }
  }

  // random birds on the canvas

  for (let b of birds) {
    b.move();
    // if the dinosaur hits the bird, game over
    if (dino.hits(b)) {
      text("Game is over!", 20, 20);
      gameIsOver = true;
      noLoop();
    }
  }

  for (let c of clouds) {
    c.move();
    c.draw();
  }

  // drawing
  for (let c of cacti) {
    c.draw();
  }

  for (let b of birds) {
    b.draw();
  }
  dino.draw();
}

// gradient for background
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis == "Y") {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      var inter = map(i, y, y + h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis == "X") {
    // Left to right gradient
    for (let j = x; j <= x + w; j++) {
      var inter2 = map(j, x, x + w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y + h);
    }
  }
}
