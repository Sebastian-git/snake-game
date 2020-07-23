/* game.js

This code handles the game elements and interactions on game.html. 
Most of your work will be here!
*/

/* Initializing variables and objects */
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const grid = 40;
let count = 0;
let score = 0;
let snake = {
  color: "#90EE90",
  x: grid * 2, // snake start x position (added)
  y: grid * 2, // snake start y position (added)
  x_step: grid, //snake velocity. moves one grid length every frame in either the x or y direction
  y_step: 0,
  cells: [], //an array that keeps track of all grids the snake body occupies
  currentLength: 4 //current length of the snake. grows when eating an apple.
};

let apple = {
  x: 0,
  y: grid * 2,
  color: "red"
};

function pauseGame() {
  alert("Game Paused");
}

/***MAIN FUNCTIONS***/

/* start the game */
requestAnimationFrame(snakeSquadLoop);

/* Listen to keyboard events to move the snake */
document.addEventListener("keydown", function(e) {
  // prevent snake from backtracking on itself by checking that it's
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.which === 37 && snake.x_step === 0) {
    snake.x_step = -grid;
    snake.y_step = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.y_step === 0) {
    snake.y_step = -grid;
    snake.x_step = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.x_step === 0) {
    snake.x_step = grid;
    snake.y_step = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.y_step === 0) {
    snake.y_step = grid;
    snake.x_step = 0;
  }
});

/***HELPER FUNCTIONS***/

/*snakeSquadLoop: This is the main code that is run each time the game loops*/
function snakeSquadLoop() {
  requestAnimationFrame(snakeSquadLoop);
  // if count < 16, then keep looping. Don't animate until you get to the 16th frame. This controls the speed of the animation.

  let speed = 16;
  if (score > 0 && speed > 0) speed -= score;
  if (count < speed) {
    count++;
    return;
  }
  //Otherwise, it's time to animate.
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  /*TO DO:which functions do we need to run for this game to work, and in what order?*/
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

/*drawApple
uses context functions to fill the cell at apple.x and apple.y with apple.color 
*/
function drawApple() {
  /* TO DO */
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x, apple.y, grid, grid);
}

/*drawSnake
For each cell of the snake, fill in the grid at the location (cell.x, cell.y) with the snake.color 
If the cell is the first cell in the array, use the drawCellWithBitmoji function to draw that cell as the user's bitmoji 
*/
function drawSnake() {
  /* TO DO */
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

/*drawCellWithBitmoji
Takes a cell (with an x and y property) and fills the cell with a bitmoji instead of a square
*/
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

/*snakeTouchesApple
checks if any cell in the snake is at the same x and y location of the apple
returns true (the snake is eating the apple) or false (the snake is not eating the apple)
*/
function snakeTouchesApple() {
  /* TO DO */
  if (apple.x == snake.x && apple.y == snake.y) return true;
  return false;
}

/*lengthenSnakeByOne
increments the currentLength property of the snake object by one to show that the snake has eaten an apple
*/
function lengthenSnakeByOne() {
  snake.currentLength = snake.currentLength + 1;
}

/*randomlyGenerateApple
uses getRandomInt to generate a new x and y location for the apple within the grid
this function does not draw the apple itself, it only stores the new locations in the apple object
*/
function randomlyGenerateApple() {
  apple.x = getRandomInt(0, 15) * grid;
  apple.y = getRandomInt(0, 15) * grid;
}

/*checkCrashItself
checks if any cell in the snake is at the same x and y location of the any other cell of the snake
returns true (the snake crashed into itself) or false (the snake is not crashing) 
*/
function checkCrashItself() {
  /* TO DO */
  for (var i = 1; i < snake.cells.length; i++) {
    if (snake.cells[i].x == snake.x && snake.cells[i].y == snake.y) return true;
  }
  return false;
}


/*endGame
displays an alert and reloads the page
*/
function endGame() {
  alert("GAME OVER");
  snake.cells = [];
  document.location.reload();
}

/*getRandomInt
takes a mininum and maximum integer
returns a whole number randomly in that range, inclusive of the mininum and maximum
see https://stackoverflow.com/a/1527820/2124254
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
