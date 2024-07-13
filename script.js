const gridElement = document.getElementById("grid");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const clearButton = document.getElementById("clear");

const rows = 30;
const cols = 50;
let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
let intervalId;

function createGrid() {
  gridElement.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => toggleCell(r, c, cell));
      gridElement.appendChild(cell);
    }
  }
}

function toggleCell(row, col, cell) {
  grid[row][col] = grid[row][col] === 0 ? 1 : 0;
  cell.classList.toggle("alive", grid[row][col] === 1);
}

function step() {
  const newGrid = grid.map((arr) => arr.slice());

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const aliveNeighbors = countAliveNeighbors(r, c);
      if (grid[r][c] === 1) {
        newGrid[r][c] = aliveNeighbors < 2 || aliveNeighbors > 3 ? 0 : 1;
      } else {
        newGrid[r][c] = aliveNeighbors === 3 ? 1 : 0;
      }
    }
  }
  grid = newGrid;
  updateGrid();
}

function countAliveNeighbors(row, col) {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (
        r >= 0 &&
        r < rows &&
        c >= 0 &&
        c < cols &&
        (r !== row || c !== col)
      ) {
        count += grid[r][c];
      }
    }
  }
  return count;
}

function updateGrid() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    cell.classList.toggle("alive", grid[row][col] === 1);
  });
}

startButton.addEventListener("click", () => {
  if (!intervalId) {
    intervalId = setInterval(step, 100);
    startButton.disabled = true;
    stopButton.disabled = false;
  }
});

stopButton.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = null;
  startButton.disabled = false;
  stopButton.disabled = true;
});

clearButton.addEventListener("click", () => {
  grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  updateGrid();
});

createGrid();
stopButton.disabled = true;
