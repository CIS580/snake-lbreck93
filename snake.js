/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();


var w = frontBuffer.width;
var h = frontBuffer.height;

var snake;
var food;
var score;
var direction = "right";
var pixel_width = 10;

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = (newTime - oldTime);
  update(elapsedTime);
  render(elapsedTime);

  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);
  // Run the next loop

  window.requestAnimationFrame(loop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  var head_x = snake[0].x;
  var head_y = snake[0].y;
  var tail;

  // TODO: Spawn an apple periodically
  // Apple spawns when game starts, and after it has been eaten.
  // TODO: Grow the snake periodically
  // Snake grows after eating apple.
  // TODO: Move the snake

  if(direction == "right") head_x++;
  else if(direction == "left") head_x--;
  else if(direction == "up") head_y--;
  else if(direction == "down") head_y++;

  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  if(head_x == -1 || head_x == w/pixel_width || head_y == -1 || head_y == h/pixel_width)
  {
    init();
    return;
  }
  // TODO: Determine if the snake has eaten an apple
  if(head_x == food.x && head_y == food.y)
  {
    tail = {
      x: head_x,
      y: head_y
    };
    spawn_food();
    score++;
  }
  else
  {
    tail = snake.pop();
    tail.x = head_x;
    tail.y = head_y;
  }
  snake.unshift(tail);
  // TODO: Determine if the snake has eaten its tail
  if (eat_self(head_x, head_y, snake)){
    return
  }
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer
  backCtx.fillStyle = "white";
  backCtx.fillRect(0, 0, w, h);
  backCtx.strokeStyle = "black";
  backCtx.strokeRect(0, 0, w, h);

  for(var i = 0; i < snake.length; i++)
  {
    var c = snake[i];
    render_elements(c.x, c.y, "red", "white");
  }
  render_elements(food.x, food.y, "green", "white");
  document.getElementById('score').textContent = score;
}

$(document).keydown(function(e){
  event.preventDefault();
  var key = e.which;
  if(key == "37" && direction != "right")
    direction = "left";
  else if(key == "40" && direction != "up")
    direction = "down";
  else if(key == "39" && direction != "left")
    direction = "right";
  else if(key == "38" && direction != "down")
    direction = "up";
});

function init(){
  direction = "right";
  score = 0;
  spawn_snake();
  spawn_food();
}

function spawn_snake(){
  var length = 3;
  snake = [];

  for(var i = length-1; 0<=i; i--)
  {
    snake.push({x: i, y:0});
  }
}

function spawn_food()
{
  food = {
    x: Math.round(Math.random()*(w-pixel_width)/pixel_width),
    y: Math.round(Math.random()*(h-pixel_width)/pixel_width),
  };
}

function eat_self(x, y, array)
{
  for(var i = 0; i < array.length; i++)
  {
    if(array[i].x == x && array[i].y == y)
      return true;
  }
  return false;
}

function render_elements(x, y, color, stroke){
  backCtx.fillStyle = color;
  backCtx.fillRect(x*pixel_width, y*pixel_width, pixel_width, pixel_width);
  backCtx.strokeStyle = stroke;
  backCtx.strokeRect(x*pixel_width, y*pixel_width, pixel_width, pixel_width);
}

init();
window.requestAnimationFrame(loop);