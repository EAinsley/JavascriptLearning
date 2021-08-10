let ROWS = 15;
let COLS = 15;

function main() {
  let grid_array = buildGrid(ROWS, COLS);
  const button_next = document.querySelector("#next");
  const button_random = document.querySelector("#random");
  const button_clear = document.querySelector("#clear");
  button_next.addEventListener("click", () => {
    grid_array = nextGeneration(grid_array);
  });
  button_random.addEventListener("click", () => {
    grid_array = randomGrid(grid_array);
  });
  button_clear.addEventListener("click", () => {
    grid_array = clearGrid(grid_array);
  });
  grid_array.forEach((row, r) => {
    row.forEach((cell, c) => {
      cell["checkbox"].addEventListener("change", (e) => {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr == 0 && dc == 0) continue;
            if (r + dr < 0 || r + dr >= ROWS || c + dc < 0 || c + dc >= COLS)
              continue;
            if (e.target.checked)
              grid_array[r + dr][c + dc]["neighbor_count"]++;
            else grid_array[r + dr][c + dc]["neighbor_count"]--;
          }
        }
      });
    });
  });
}

// (width:Nuber, height:Number) -> grid_array:
// Array[
//  Array[
//    map{checkbox: HTMLInputElement, neighbor_count: Number}
//  ]
// ]
function buildGrid(rows, cols) {
  let grid_array = new Array();
  const table = document.createElement("table");
  for (let r = 0; r < rows; r++) {
    const row = document.createElement("tr");
    grid_array.push([]);
    for (let c = 0; c < cols; c++) {
      const item = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      // checkbox.setAttribute("disabled", "");
      grid_array[r].push({ checkbox });
      checkbox.checked = Math.random() >= 0.5 ? true : false;
      item.appendChild(checkbox);
      row.appendChild(item);
    }
    table.appendChild(row);
  }
  document.querySelector("#grid").appendChild(table);
  grid_array = updateNeighborCount(grid_array);
  return grid_array;
}

function updateNeighborCount(grid_array) {
  const rows_count = grid_array.length;
  if (rows_count == 0) return;
  const cols_count = grid_array[0].length;
  const new_grid = [];
  for (let r = 0; r < rows_count; r++) {
    const rows = [];
    for (let c = 0; c < cols_count; c++) {
      const { checkbox } = grid_array[r][c];
      rows.push({ checkbox, neighbor_count: 0 });
    }
    new_grid.push(rows);
  }
  for (let r = 0; r < rows_count; r++) {
    for (let c = 0; c < cols_count; c++) {
      if (!new_grid[r][c]["checkbox"].checked) continue;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr == 0 && dc == 0) continue;
          if (r + dr < 0 || r + dr >= rows_count) continue;
          if (c + dc < 0 || c + dc >= cols_count) continue;
          new_grid[r + dr][c + dc]["neighbor_count"]++;
        }
      }
    }
  }
  return new_grid;
}

function nextGeneration(grid_array) {
  for (const row of grid_array) {
    for (let cell of row) {
      let { neighbor_count: count } = cell;
      if (cell["checkbox"].checked) {
        if (count < 2 || count > 3) {
          cell["checkbox"].checked = false;
        }
      } else {
        if (count == 3) cell["checkbox"].checked = true;
      }
    }
  }
  return updateNeighborCount(grid_array);
}

function randomGrid(grid_array) {
  for (const row of grid_array) {
    for (let cell of row) {
      cell["checkbox"].checked = Math.random() >= 0.5 ? true : false;
    }
  }
  return updateNeighborCount(grid_array);
}
function clearGrid(grid_array) {
  for (const row of grid_array) {
    for (let cell of row) {
      cell["checkbox"].checked = false;
    }
  }
  return updateNeighborCount(grid_array);
}
function resetGrid() {
  let grid = document.querySelector("grid");
  while (grid.firstChild) grid.removeChild(grid.firstChild);
  ROWS = Math.min(
    Math.max(
      Number(prompt("Rows? (default: 10, maximum: 30, minimum: 10")),
      10
    ),
    30
  );
  COLS = Math.min(
    Math.max(
      Number(prompt("Columns? (default: 10, maximum: 30, minimum: 10")),
      10
    ),
    30
  );
  return buildGrid(ROWS, COLS);
}

window.addEventListener("load", main);
