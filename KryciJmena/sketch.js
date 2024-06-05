const canvasSize = screen.height - 100;
const margin = 5;

const gridSize = 5;
const assasins = 1;
const agents = 5;

const colors = new Array('blue', 'red')

let grid;

function createArray(rows, columns, value) {
  //Create an array of size rows * columns filled with value
  let array = new Array(rows);

  for(let i = 0; i < rows; i++) {
    array[i] = new Array(columns);

    for(let j = 0; j < columns; j++) {
      array[i][j] = value;
    }  
  }

  return array;
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

function generate() {
  // Clear the grid
  grid = createArray(gridSize, gridSize, 0);

  // Create an array of possible cards
  let possiblePoints = Array();
  for(let i = 0; i < gridSize; i++) {
    for(let j = 0; j < gridSize; j++) {
      possiblePoints.push(new Array(i, j));
    }
  }

  // Generate   agents
  for(let tym = 0; tym < colors.length; tym++) {
    for(let agent = 0; agent < agents; agent++) {
      shuffleArray(possiblePoints);
      const pozice = possiblePoints.pop();

      grid[pozice[0]][pozice[1]] = tym + 1;
    }
  }

  // Generate assasins
  for(let assasin = 0; assasin < assasins; assasin++) {
    shuffleArray(possiblePoints);
    const pozice = possiblePoints.pop();
  
    grid[pozice[0]][pozice[1]] = -1;
    redraw();
  }
}

function setup() {
  createCanvas(canvasSize, canvasSize, document.getElementById("canvas"));
  strokeWeight(0);

  grid = createArray(gridSize, gridSize, 0);
  generate();
}

function draw() {
  // Calculate cell size
  cellSizeX = width / gridSize;
  cellSizeY = height / gridSize;

  // Clear canvas
  background(255);

  // Draw grid to canvas
  for(let i = 0; i < gridSize; i++) {
    for(let j = 0; j < gridSize; j++) {
      // If position is assasin
      if(grid[i][j] == -1) {
        fill(0)
        rect(i*cellSizeX + margin, j*cellSizeY + margin, cellSizeX - 2 * margin, cellSizeY - 2 * margin);
      }

      // If position is agent
      if(grid[i][j] > 0) {
        fill(colors[grid[i][j] - 1])
        rect(i*cellSizeX + margin, j*cellSizeY + margin, cellSizeX - 2 * margin, cellSizeY - 2 * margin);
      }

      // If position is empty
      if(grid[i][j] == 0) {
        fill('beige');
        rect(i*cellSizeX + margin, j*cellSizeY + margin, cellSizeX - 2 * margin, cellSizeY - 2 * margin);
      }
    }  
  }
}