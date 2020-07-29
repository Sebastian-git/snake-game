// Initialize variables and objects
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const grid = 40;
let count = 0;
let score = 0;
let snake = {
  color: "#90EE90",
  x: grid * 2, 
  y: grid * 2,
  x_step: grid,
  y_step: 0,
  cells: [],
  currentLength: 4 
};

let apple = {
  x: 0,
  y: grid * 2,
  color: "red"
};

// Pause game
function pauseGame() {
  alert("Game Paused");
}

// Start game
requestAnimationFrame(snakeSquadLoop);

document.addEventListener("keydown", function(e) {

  // left
  if (e.which === 37 && snake.x_step === 0) {
    snake.x_step = -grid;
    snake.y_step = 0;
  }
  // up
  else if (e.which === 38 && snake.y_step === 0) {
    snake.y_step = -grid;
    snake.x_step = 0;
  }
  // right
  else if (e.which === 39 && snake.x_step === 0) {
    snake.x_step = grid;
    snake.y_step = 0;
  }
  // down
  else if (e.which === 40 && snake.y_step === 0) {
    snake.y_step = grid;
    snake.x_step = 0;
  }
});

// Main loop for game
function snakeSquadLoop() {
  requestAnimationFrame(snakeSquadLoop);

  // Speed up snake as game snake score rises
  let speed = 16;
  if (score > 0 && speed > 0) speed -= score;
  if (count < speed) {
    count++;
    return;
  }
  
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawApple();
  calculateSnakeMove();
  if (snakeTouchesApple()) {
    score++;
    document.getElementById("score").innerHTML = `Score: ${score}`;
    lengthenSnakeByOne();
    randomlyGenerateApple();
  }
  if (checkCrashItself()) {
    endGame();
  }
}

function calculateSnakeMove() {
  // move snake by its velocity
  snake.x += snake.x_step;
  snake.y += snake.y_step;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // remove cells as we move away from them
  if (snake.cells.length > snake.currentLength) {
    snake.cells.pop();
  }
}

// Color in apple
function drawApple() {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x, apple.y, grid, grid);
}

// Color in snake
function drawSnake() {
  for (var i = 0; i < snake.cells.length; i++) {
    const currentCell = snake.cells[i];
    if (i == 0) {
      drawCellWithBitmoji(currentCell);
    } else {
      const canvas = document.getElementById("game");
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = snake.color;
      ctx.fillRect(currentCell.x, currentCell.y, grid, grid);
    }
  }
}

// Replaces head of snake with bitmoji
function drawCellWithBitmoji(cell) {
  var avatar_url = localStorage.getItem("avatarurl");
  document.getElementById("avatar").src = avatar_url;
  context.drawImage(
    document.getElementById("avatar"),
    0,
    0,
    200,
    200,
    cell.x,
    cell.y,
    grid,
    grid
  );
}

// Returns true if snake is touching apple
function snakeTouchesApple() {
  if (apple.x == snake.x && apple.y == snake.y) return true;
  return false;
}

// Increments snake length
function lengthenSnakeByOne() {
  snake.currentLength += 1;
}

// Generates apple in new random location on grid
function randomlyGenerateApple() {
  apple.x = getRandomInt(0, 15) * grid;
  apple.y = getRandomInt(0, 15) * grid;
}

// Checks if snake has touched itself
function checkCrashItself() {
  for (var i = 1; i < snake.cells.length; i++) {
    if (snake.cells[i].x == snake.x && snake.cells[i].y == snake.y) return true;
  }
  return false;
}

// Displays game over alert
function endGame() {
  alert("GAME OVER");
  snake.cells = [];
  document.location.reload();
}

// Returns rando integer between the min and max parameters
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
