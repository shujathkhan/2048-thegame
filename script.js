let grid;
let grid_new;
let score = 0;
let arrSize = 4; // To change to 8x8 board
let width; // To change the size of the tile
let fontSize;
if (arrSize == 8) {
  width = 50;
  fontSize = 15;
} else {
  width = 100;
  fontSize = 30;
}
let winScore = 4096; // To change the win score
/* AUXILLARY GLOBAL FUNCTIONS */

/* Creating a blank grid of defined size */
function blankGrid(arrSize) {
  return Array(arrSize)
    .fill(0)
    .map(a => Array(arrSize).fill(0));
}

/* Adding a number at random places */
function addRandom(arrSize) {
  let emptySpaces = [];
  for (let i = 0; i < arrSize; i++) {
    for (let j = 0; j < arrSize; j++) {
      if (grid[i][j] === 0) {
        emptySpaces.push({
          r: i,
          c: j
        });
      }
    }
  }
  if (emptySpaces.length > 0) {
    let randSpot = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
    let rand = Math.random();
    grid[randSpot.r][randSpot.c] = rand > 0.3 ? 2 : 4;
  }
}

/* Getting a grid transpose */
function transposeGrid(array) {
  return array[0].map((col, i) => array.map(row => row[i]));
}

/* creating a copy of the grid */
function copyGrid(grid) {
  return grid.map(function(arr) {
    return arr.slice();
  });
}

/* checking if indices match to add them at a later point */
function matchGrids(a, b) {
  for (let i = 0; i < arrSize; i++) {
    for (let j = 0; j < arrSize; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }
  return false;
}

/* reversing the grid */
function flipGrid(grid) {
  for (let i = 0; i < arrSize; i++) {
    grid[i].reverse();
  }
  return grid;
}

/* GAME OPERATIONS */

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

// making new array
function slide(row) {
  let arr = row.filter(val => val);
  let missing = arrSize - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

// adding numbers if they are equal
function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = 0;
    }
  }
  return row;
}

// Check to see if there target is achieved
function isGameWon(grid) {
  for (let i = 0; i < arrSize; i++) {
    for (let j = 0; j < arrSize; j++) {
      if (grid[i][j] == winScore) {
        return true;
      }
    }
  }
  return false;
}

// Check to see if there are no more moves left
function isGameOver(grid) {
  for (let i = 0; i < arrSize; i++) {
    for (let j = 0; j < arrSize; j++) {
      if (grid[i][j] == 0) {
        return false;
      }
      if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
        return false;
      }
      if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
        return false;
      }
    }
  }
  return true;
}

/* INITIALIZING GRID SKETCH */
function setup() {
  createCanvas(arrSize * width, arrSize * width);
  noLoop();
  grid = blankGrid(arrSize);
  grid_new = blankGrid(arrSize);
  // console.table(grid);
  addRandom(arrSize);
  addRandom(arrSize);
  updateCanvas();
}

// On every key press
function keyPressed() {
  let flipped = false;
  let rotated = false;
  let played = true;
  switch (keyCode) {
    case 100:
      // do nothing to move down
      break;
    case 52:
      // do nothing to move down
      break;
    case 99:
      grid = flipGrid(grid);
      flipped = true;
      break;
    case 51:
      grid = flipGrid(grid);
      flipped = true;
      break;
    case 98:
      grid = transposeGrid(grid);
      rotated = true;
      break;
    case 50:
      grid = transposeGrid(grid);
      rotated = true;
      break;
    case 97:
      grid = transposeGrid(grid);
      grid = flipGrid(grid);
      rotated = true;
      flipped = true;
      break;
    case 49:
      grid = transposeGrid(grid);
      grid = flipGrid(grid);
      rotated = true;
      flipped = true;
      break;
    default:
      played = false;
  }

  if (played) {
    let past = copyGrid(grid);
    for (let i = 0; i < arrSize; i++) {
      grid[i] = operate(grid[i]);
    }
    let changed = matchGrids(past, grid);
    if (flipped) {
      grid = flipGrid(grid);
    }
    if (rotated) {
      grid = transposeGrid(grid);
    }
    console.log(changed);

    if (changed) {
      addRandom(arrSize);
      console.table(grid);
    }
    updateCanvas();

    let gameover = isGameOver(grid);
    if (gameover) {
      console.log("GAME OVER");
      console.table(grid);
      swal("Noooooo!", "Better luck next time!", "error").then(() => {
        location.reload();
      });
    }

    let gamewon = isGameWon(grid);
    if (gamewon) {
      console.table(grid);
      console.log("YASSSSSS");
      swal({
        title: "YASSSS!",
        text: "You won, would you like to play on?",
        icon: "success",
        buttons: true,
        dangerMode: true
      }).then(willEnd => {
        if (willEnd) {
          swal("Poof! Your game has ended!", {
            icon: "success"
          }).then(() => {
            location.reload();
          });
        } else {
          swal("Play on!");
        }
      });
    }
  }
}

/* Refreshing the p5 sketch */
function updateCanvas() {
  background(255);
  drawGrid();
  select("#score").html(score);
}

/* Drawing the p5 sketch */
function drawGrid() {
  for (let i = 0; i < arrSize; i++) {
    for (let j = 0; j < arrSize; j++) {
      noFill();
      strokeWeight(2);
      let val = grid[i][j];
      let s = val.toString();
      if (grid_new[i][j] === 1) {
        stroke(200, 0, 200);
        strokeWeight(16);
        grid_new[i][j] = 0;
      } else {
        strokeWeight(4);
        stroke(0);
      }

      if (val != 0) {
        fill("lightblue");
      } else {
        noFill();
      }
      rect(i * width, j * width, width, width, 5);
      if (val !== 0) {
        textAlign("CENTER", "CENTER");
        noStroke();
        fill(0);
        textSize(fontSize);
        text(
          val,
          i * width + width / 2 - width / 10,
          j * width + width / 2 + width / 10
        );
      }
    }
  }
}
