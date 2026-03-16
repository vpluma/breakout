// ---- SETUP ----
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// ---- PADDLE ----
var paddle = {
  x: 180,
  y: 370,
  width: 120,
  height: 12,
  speed: 7,
  color: "royalblue"
};

// ---- BALL ----
var ball = {
  x: 240,
  y: 200,
  size: 10,
  speedX: 4,
  speedY: -4,
  color: "white"
};

// ---- SCORE ----
var score = 0;

// ---- BRICKS ----
var brickRows    = 4;
var brickColumns = 8;
var brickWidth   = 50;
var brickHeight  = 18;
var brickPadding = 6;
var brickStartX  = 16;
var brickStartY  = 30;

var brickColors = ["tomato", "orange", "gold", "limegreen"];

// Create the bricks as a 2D array (a grid)
var bricks = [];
for (var row = 0; row < brickRows; row++) {
  bricks[row] = [];
  for (var col = 0; col < brickColumns; col++) {
    bricks[row][col] = { visible: true };
  }
}

// ---- KEYBOARD ----
var rightPressed = false;
var leftPressed  = false;

document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === "ArrowLeft")  leftPressed  = true;
});

document.addEventListener("keyup", function(e) {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft")  leftPressed  = false;
});

// ---- DRAW FUNCTIONS ----

function drawPaddle() {
  ctx.fillStyle = paddle.color;
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 6);
  ctx.fill();
}

function drawBall() {
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawBricks() {
  for (var row = 0; row < brickRows; row++) {
    for (var col = 0; col < brickColumns; col++) {

      if (bricks[row][col].visible === true) {
        var brickX = brickStartX + col * (brickWidth  + brickPadding);
        var brickY = brickStartY + row * (brickHeight + brickPadding);

        ctx.fillStyle = brickColors[row];
        ctx.beginPath();
        ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 4);
        ctx.fill();
      }

    }
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 16);
}

// ---- COLLISION: Ball hits a brick? ----

function checkBrickCollisions() {
  for (var row = 0; row < brickRows; row++) {
    for (var col = 0; col < brickColumns; col++) {

      var brick = bricks[row][col];

      if (brick.visible === true) {
        var brickX = brickStartX + col * (brickWidth  + brickPadding);
        var brickY = brickStartY + row * (brickHeight + brickPadding);

        // Check if the ball is touching this brick
        var hitLeft   = ball.x + ball.size > brickX;
        var hitRight  = ball.x - ball.size < brickX + brickWidth;
        var hitTop    = ball.y + ball.size > brickY;
        var hitBottom = ball.y - ball.size < brickY + brickHeight;

        if (hitLeft && hitRight && hitTop && hitBottom) {
          ball.speedY = -ball.speedY;  // bounce the ball
          brick.visible = false;        // hide the brick
          score = score + 1;            // add to score
        }
      }

    }
  }
}


// ---- MAIN GAME LOOP ----

function gameLoop() {

  // Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw everything
  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();

  // Move the paddle
  if (rightPressed && paddle.x + paddle.width < canvas.width) {
    paddle.x = paddle.x + paddle.speed;
  }
  if (leftPressed && paddle.x > 0) {
    paddle.x = paddle.x - paddle.speed;
  }

  // Move the ball
  ball.x = ball.x + ball.speedX;
  ball.y = ball.y + ball.speedY;

  // Bounce off left and right walls
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.speedX = -ball.speedX;
  }

  // Bounce off the top wall
  if (ball.y - ball.size < 0) {
    ball.speedY = -ball.speedY;
  }

  // Bounce off the paddle
  if (ball.y + ball.size >= paddle.y &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width) {
    ball.speedY = -ball.speedY;
  }

  // Check if ball hits bricks
  checkBrickCollisions();

  // Did the ball fall off the bottom? GAME OVER
  if (ball.y - ball.size > canvas.height) {
    document.getElementById("message").innerText = "💀 Game Over! Score: " + score;
    return; // stop the loop
  }

  // Did the player break all the bricks? YOU WIN
  if (score === brickRows * brickColumns) {
    document.getElementById("message").innerText = "🎉 You Win! Score: " + score;
    return; // stop the loop
  }

  // Keep the loop going (~60 times per second)
  requestAnimationFrame(gameLoop);
}

// Start the game!
gameLoop();

