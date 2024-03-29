// TODO: Disconnect draw and simulation functions

const cellSize = 20;
const canvasSize = 800;

let gridSize = Math.floor(canvasSize / cellSize);
let grid;

let speedInput;

// Track time since last simulation to keep a constant simulation frame rate
let timeSinceSim = 0;
let simulate = true;

// Simulation speed control
speedInput = document.getElementById("speed");

function simulationPlay() {
  simulate = true;
}

function simulationStop() {
  simulate = false;
}

function simulationStep() {
  grid = simulateGrid();
  redraw();
}

function createArray(rows, columns, value) {
  //Create an array of size rows*columns, filled with value
  let array = new Array(rows);

  for(let i = 0; i < rows; i++) {
    array[i] = new Array(columns);

    for(let j = 0; j < columns; j++) {
      array[i][j] = value;
    }  
  }

  return array;
}

function countNeighbors(grid, row, column) {
  let neighbors = 0;

  // Count cells in a 3x3 square, including the middle
  for(let i = max(row - 1, 0); i < min(row + 2, grid.length); i++) {
    for(let j = max(column - 1, 0); j < min(column + 2, grid[row].length); j++) {
      neighbors += grid[i][j];
    }  
  }

  // Subtract the middle, as it is not a neighbor
  return neighbors - grid[row][column];
}

function simulateGrid() {
  // If simulation is paused, return the unchanged grid
  if (!simulate) {
    return grid;
  }

  newGrid = createArray(gridSize, gridSize, 0);

  for(let i = 0; i < gridSize; i++) {
    for(let j = 0; j < gridSize; j++) {
      let neighbors = countNeighbors(grid, i, j);

      if (grid[i][j] == 0) {
        // If cell is dead and has 3 neighbors, make it alive
        if (neighbors == 3) newGrid[i][j] = 1;
        continue;
      }

      if (neighbors < 2) {
        // If cell is alive and has 0 or 1 neighbors, kill it
        newGrid[i][j] = 0;
      } else if (neighbors > 3) {
        // If cell is alive and has 2 or 3 neighbors, keep it alive
        newGrid[i][j] = 0;
      } else {
        // If cell is alive and has 4 or more neighbors, kill it
        newGrid[i][j] = 1;
      }
    }  
  }

  return newGrid;
}

function setup() {
  createCanvas(canvasSize, canvasSize, document.getElementById("canvas"));

  grid = createArray(gridSize, gridSize, 0);

  // Simulation seed
  grid[6][3] = 1;
  grid[7][4] = 1;
  grid[5][5] = 1;
  grid[6][5] = 1;
  grid[7][5] = 1;
}

function draw() {
  // Clear canvas
  background(0);
  
  // Set brush color
  fill(255);

  // Draw grid to canvas
  for(let i = 0; i < gridSize; i++) {
    for(let j = 0; j < gridSize; j++) {
      if(grid[i][j] == 1) {
        square(i*cellSize, j*cellSize, cellSize);
      }
    }  
  }

  // Simulate the grid
  if (timeSinceSim / 1000 > 1 / speedInput.value) {
    grid = simulateGrid();
    timeSinceSim = 0;
  }

  timeSinceSim += deltaTime;
}

function mouseDragged() {
  mouseControl();
}

function mousePressed() {
  mouseControl();
}

function mouseControl() {
  // Add cells under the mouse while pressed
  if (mouseIsPressed === true && mouseButton === LEFT) {
    let gridX = Math.floor(mouseX / cellSize);
    let gridY = Math.floor(mouseY / cellSize);
    
    grid[gridX][gridY] = 1;
  }
}