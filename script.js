"use strict";

const wingSound = new Audio("./sounds/wing.wav");
const pointSound = new Audio("./sounds/point.wav");
let hitSound = new Audio("./sounds/hit.wav");
const dieSounds = new Audio("./sounds/die.wav");
const gameScreen = document.querySelector(".game");
const message = document.querySelector(".message");
const ground = document.querySelector(".ground");
const bird = document.querySelector(".bird");
let birdY = parseInt(bird.getBoundingClientRect().top) / 2;
let pipeX = -100;
let gravity = 2;
let pipeList = [];
const dummyPipeList = [];
const randomNum = Math.floor(Math.random() * 3);
const birdColors = ["bird", "blue", "yellow"];
const pipeGap = 200;
let pipeSpeed = 3;
let birdIndex = 1;
let score = 0;
let pipeInterval;

const scoreCard = document.querySelector(".score");
scoreCard.style.display = "none";
const scoreCard2 = document.querySelector(".score2");
scoreCard2.style.display = "none";
let gameOver = false;
let gameStart = false;
bird.style.display = "none";
let highestScore = 0;
const gameOverMessage = document.querySelector(".gameOver");
gameOverMessage.style.display = "none";
const restart = document.querySelector(".restart");
const messageScore = document.querySelector(".message_score");
const messageBest = document.querySelector(".message_best");

localStorage.setItem("score", score);
if (localStorage.getItem("highestScore"))
  localStorage.setItem("highestScore", localStorage.getItem("highestScore"));
else localStorage.setItem("highestScore", highestScore);

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
    displayGameOver();
  }
}

gameScreen.addEventListener("click", () => {
  if (!gameOver) {
    gravity = -3.8;
    gameStart = true;
    wingSound.play();
    message.style.display = "none";
    bird.style.display = "inline";
    scoreCard.style.display = "inline-block";
  }
});

window.addEventListener("keydown", e => {
  if (e.key == " " && !gameOver) {
    gravity = -3.8;
    gameStart = true;
    wingSound.play();
    message.style.display = "none";
    bird.style.display = "inline";
    scoreCard.style.display = "inline";
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

// creating pipe
setInterval(() => {
  if (gameStart && !gameOver) creatingPipe();
}, 1300);

// animating bird

setInterval(() => {
  bird.style.backgroundImage = `url(./images/${birdColors[randomNum]}${birdIndex}.png)`;
  if (!gameOver) birdIndex++;
  if (birdIndex > 3) birdIndex = 1;
}, 100);

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
      displayGameOver();
    }
    if (
      birdRect.right > downPipeRect.left &&
      birdRect.left < downPipeRect.right &&
      birdRect.bottom > downPipeRect.top &&
      birdRect.top < downPipeRect.bottom
    ) {
      hitSound.play();
      gameOver = true;
      displayGameOver();
    }
  });
}

function displayScore() {
  dummyPipeList.forEach(({ upperPipe, downPipe }, i) => {
    const upperPipeRect = upperPipe.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();

    if (parseInt(birdRect.left, 10) > parseInt(upperPipeRect.right, 10)) {
      dummyPipeList.splice(i, 1);
      score++;
      if (score < 10) {
        scoreCard.style.backgroundImage = `url(./images/${score}.png)`;
      } else {
        scoreCard2.style.display = "inline-block";
        scoreCard.style.backgroundImage = `url(./images/${
          String(score)[0]
        }.png)`;
        scoreCard2.style.backgroundImage = `url(./images/${
          String(score)[1]
        }.png)`;
      }
      if (localStorage.getItem("highestScore") < score)
        localStorage.setItem("highestScore", highestScore);

      pointSound.play();

      return;
    }
  });
}

function displayGameOver() {
  gameOverMessage.style.display = "flex";
  scoreCard.style.display = "none";
  messageScore.textContent = `SCORE : ${score}`;
  messageBest.textContent = `BEST : ${localStorage.getItem("highestScore")}`;
}

restart.addEventListener("click", () => {
  location.reload();
});
