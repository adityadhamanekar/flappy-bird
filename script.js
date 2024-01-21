"use strict";

const wingSound = new Audio("./sounds/wing.wav");
const pointSound = new Audio("./sounds/point.wav");
let hitSound = new Audio("./sounds/hit.wav");
const dieSounds = new Audio("./sounds/die.wav");
const gameScreen = document.querySelector(".game");
const ground = document.querySelector(".ground");
const bird = document.querySelector(".bird");
let birdY = parseInt(bird.getBoundingClientRect().top) / 2;
let pipeX = -100;
let gravity = 2;
let pipeList = [];
const dummyPipeList = [];
const pipeGap = 200;
let pipeSpeed = 3;
let birdIndex = 1;
let score = 0;
let pipeInterval;
const scoreCard = document.querySelector(".score");
let gameOver = false;
let gameStart = false;

// gamelooping

function gameLoop() {
  if (gameStart) {
    flyingBird();
    gravity += 0.2;
  }
  window.requestAnimationFrame(gameLoop);
  if (!gameOver && gameStart) {
    displayPipe();
    movePipe();
    collision();
    displayScore();
  }
}

gameLoop();

// flying bird
function flyingBird() {
  birdY += gravity;
  bird.style.top = birdY + "px";
  const birdRect = bird.getBoundingClientRect();
  const groundRect = ground.getBoundingClientRect();
  if (birdRect.top + birdRect.height >= groundRect.top) {
    bird.style.top = 38.5 + "rem";
    gameOver = true;
    if (hitSound) hitSound.play();

    hitSound = null;
  }
}

gameScreen.addEventListener("click", () => {
  if (!gameOver) {
    gravity = -3.8;
    gameStart = true;
    wingSound.play();
  }
});

window.addEventListener("keydown", e => {
  if (e.key == " " && !gameOver) {
    gravity = -3.8;
    gameStart = true;
    wingSound.play();
  }
});

// creating pipe
function creatingPipe() {
  const upperPipe = document.createElement("div");
  const downPipe = document.createElement("div");
  upperPipe.classList.add("upperPipe");
  downPipe.classList.add("downPipe");
  upperPipe.style.right = pipeX + "px";
  downPipe.style.right = pipeX + "px";
  const pipeTop = Math.floor(Math.random() * (300 - 200) + 200);
  upperPipe.style.top = -pipeTop + "px";
  downPipe.style.top = -pipeTop + 320 + pipeGap + "px";
  pipeList.push({ upperPipe, downPipe });
  dummyPipeList.push({ upperPipe, downPipe });
}

setInterval(() => {
  if (gameStart && !gameOver) creatingPipe();
}, 1300);

// displaying pipe
function displayPipe() {
  pipeList.forEach(({ upperPipe, downPipe }, i) => {
    gameScreen.insertAdjacentElement("beforeend", upperPipe);
    gameScreen.insertAdjacentElement("beforeend", downPipe);
  });
}

// moving pipe to left
function movePipe() {
  pipeList.forEach(({ upperPipe, downPipe }, i) => {
    upperPipe.style.right = parseInt(upperPipe.style.right) + pipeSpeed + "px";
    downPipe.style.right = parseInt(upperPipe.style.right) + pipeSpeed + "px";

    if (
      parseInt(upperPipe.style.right) >
      parseInt(gameScreen.getBoundingClientRect().width)
    ) {
      gameScreen.removeChild(upperPipe);
      gameScreen.removeChild(downPipe);
      pipeList.splice(i, 1);
    }
  });
}

// detecting collision
function collision() {
  pipeList.forEach(({ upperPipe, downPipe }, i) => {
    const upperPipeRect = upperPipe.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();
    const downPipeRect = downPipe.getBoundingClientRect();

    if (
      birdRect.right > upperPipeRect.left &&
      birdRect.left < upperPipeRect.right &&
      birdRect.bottom > upperPipeRect.top &&
      birdRect.top < upperPipeRect.bottom
    ) {
      hitSound.play();
      gameOver = true;
    }
    if (
      birdRect.right > downPipeRect.left &&
      birdRect.left < downPipeRect.right &&
      birdRect.bottom > downPipeRect.top &&
      birdRect.top < downPipeRect.bottom
    ) {
      hitSound.play();
      gameOver = true;
    }
  });
}

setInterval(() => {
  bird.style.backgroundImage = `url(images/bird${birdIndex}.png)`;
  birdIndex++;
  if (birdIndex > 3) birdIndex = 1;
}, 100);

function displayScore() {
  dummyPipeList.forEach(({ upperPipe, downPipe }, i) => {
    const upperPipeRect = upperPipe.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();

    if (parseInt(birdRect.left, 10) > parseInt(upperPipeRect.right, 10)) {
      dummyPipeList.splice(i, 1);
      score++;
      pointSound.play();
      scoreCard.textContent = `SCORE : ${score}`;
      return;
    }
  });
}
