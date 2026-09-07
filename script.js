// Functionalities/features
// 1. Jump/Fall
// 2. Move left/right
// 3. Move obstacle continuously
// 4. Collision logic
// 5. Game Over Logic

// Target elements
let game_container = document.querySelector(".game-container");
let score = document.querySelector(".score h1");
let mario = document.querySelector(".mario");
let obstacle = document.querySelector(".obstacle");

let gameScore = 0;
let marioPosition = 0;
let isJumping = false;
let gameRunning = true;
let obstacleInterval;

// JUMP
function jump() {
  if (isJumping || !gameRunning) return;

  isJumping = true;

  let startP = parseInt(mario.style.bottom) || 0;
  let endP = 300;

  let jumpInt = setInterval(() => {
    if (startP < endP) {
      startP += 10;
      mario.style.bottom = startP + "px";
    } else {
      clearInterval(jumpInt);
      fall();
    }
  }, 20);
}

//FALL

function fall() {
  let startPosition = parseInt(mario.style.bottom);

  let fallInterval = setInterval(() => {
    if (startPosition > 0) {
      startPosition -= 10;
      mario.style.bottom = startPosition + "px";
    } else {
      mario.style.bottom = "0px";
      clearInterval(fallInterval);
      isJumping = false;
    }
  }, 20);
}

//Move mario

function moveMario(direction) {
  if (!gameRunning) return;

  let activePos;

  if (direction === "left") {
    activePos = marioPosition - 10;
    mario.classList.add("flipped");
  } else {
    activePos = marioPosition + 10;
    mario.classList.remove("flipped");
  }

  let maxWidth = game_container.offsetWidth - mario.offsetWidth;

  if (activePos >= 0 && activePos <= maxWidth) {
    marioPosition = activePos;
    mario.style.left = marioPosition + "px";
  }
}

//move poll

function pollmove() {
  let obstaclePos = game_container.offsetWidth;

  obstacle.style.display = "block";

  obstacleInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(obstacleInterval);
      return;
    }

    obstaclePos -= 8;
    obstacle.style.left = obstaclePos + "px";

    // Obstacle crossed screen
    if (obstaclePos < -obstacle.offsetWidth) {
      obstaclePos = game_container.offsetWidth;
      gameScore++;
      score.textContent = "Score : " + gameScore;
    }

    if (checkCollision()) {
      gameOver();
    }
  }, 20);
}

//checkCollision

function checkCollision() {
  let marioRect = mario.getBoundingClientRect();
  let obstacleRect = obstacle.getBoundingClientRect();

  let xCollision =
    marioRect.left < obstacleRect.right && marioRect.right > obstacleRect.left;

  let yCollision =
    marioRect.top < obstacleRect.bottom && marioRect.bottom > obstacleRect.top;

  return xCollision && yCollision;
}

//game over

function gameOver() {
  gameRunning = false;
  clearInterval(obstacleInterval);

  obstacle.style.animation = "none";

  score.textContent = `GAME OVER! Your final score: ${gameScore}`;
}

// start game

pollmove();

//controls

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case " ":
    case "ArrowUp":
      jump();
      break;

    case "ArrowLeft":
    case "a":
    case "A":
      moveMario("left");
      break;

    case "ArrowRight":
    case "d":
    case "D":
      moveMario("right");
      break;
  }
});
