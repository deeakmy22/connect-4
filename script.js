const player1 = "Player 1";
const player2 = "Player 2";
let turn = player1;
let gameOver = false;
let isDropping = false;
const animationDuration = 100;

const boardElement = document.getElementById("board");
const startButton = document.getElementById("startButton");
const currentPlayer = document.getElementById("currentPlayer");
const gameOverArea = document.getElementById("gameOverArea");
const gameOverText = document.getElementById("gameOverText");
const winnerElement = document.getElementById("winner");
const restartButton = document.getElementById("restartButton");

// I use this function to reload the game when the restart game button is clicked
const restartGame = () => {
  location.reload();
};

// This function changes the name of the following player
const changeTurn = () => {
  turn = turn === player2 ? player1 : player2;
  currentPlayer.innerText = "Turn: " + turn;
};

// This function brings up the section where I write Game over! and It's a tie
const showTie = () => {
  gameOverArea.style.display = "block";
  gameOverText.innerText = "Game Over!";
  winnerElement.innerText = "It's a tie!";
};

// This function checks in all matrix if every value has a number that meens the matrix is full and then it's a tie
const checkTie = () => {
  return board.every((rows) => rows.every((value) => value !== null));
};

// This function brings up the section where I write Game over! and the name of the winner
const showWinner = (player) => {
  gameOverArea.style.display = "block";
  gameOverText.innerText = "Game Over!";
  if (player === 1) {
    winnerElement.innerText = "The winner is: " + player1;
  } else {
    winnerElement.innerText = "The winner is: " + player2;
  }
};

// I check in every vertically, horizontally and diagonally from the matrix if I have 4 chips with the same number to set the winner
const checkWinner = () => {
  // horizontally
  for (let r = 0; r < ROWS; ++r) {
    for (let c = 0; c < COLS - 3; ++c) {
      if (board[r][c] !== null) {
        if (
          board[r][c] === board[r][c + 1] &&
          board[r][c + 1] === board[r][c + 2] &&
          board[r][c + 2] === board[r][c + 3]
        ) {
          return board[r][c];
        }
      }
    }
  }

  // vertically
  for (let c = 0; c < COLS; ++c) {
    for (let r = 0; r < ROWS - 3; ++r) {
      if (board[r][c] !== null) {
        if (
          board[r][c] === board[r + 1][c] &&
          board[r + 1][c] === board[r + 2][c] &&
          board[r + 2][c] === board[r + 3][c]
        ) {
          return board[r][c];
        }
      }
    }
  }

  // anti-diagonally
  for (let r = 0; r < ROWS - 3; ++r) {
    for (let c = 0; c < COLS - 3; ++c) {
      if (board[r][c] !== null) {
        if (
          board[r][c] === board[r + 1][c + 1] &&
          board[r + 1][c + 1] === board[r + 2][c + 2] &&
          board[r + 2][c + 2] === board[r + 3][c + 3]
        ) {
          return board[r][c];
        }
      }
    }
  }

  // diagonally
  for (let r = 3; r < ROWS; ++r) {
    for (let c = 0; c < COLS - 3; ++c) {
      if (board[r][c] !== null) {
        if (
          board[r][c] === board[r - 1][c + 1] &&
          board[r - 1][c + 1] === board[r - 2][c + 2] &&
          board[r - 2][c + 2] === board[r - 3][c + 3]
        ) {
          return board[r][c];
        }
      }
    }
  }
  return 0;
};

// I use this function to display the chip with the color that corresponds to the player,
// in the matrix. I put 1 on the position that player 1 has a chip or 2 for player 2
// and after a player's chip is displayed.
const writeChip = (row, column) => {
  let realChip = document.createElement("div");

  if (turn === player2) {
    realChip.classList.add("player2");
    board[row][column] = 2;
  } else {
    realChip.classList.add("player1");
    board[row][column] = 1;
  }

  let cell = document.getElementById(row + "," + column);
  cell.appendChild(realChip);
};

// When I use async/await with delays or time intervals, I can create a new Promise and use setTimeout, which also sets a delay but only triggers once.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// This function helps me animate the chips, they will apear in the selected column from the top to bottom,
// creating a temporary chip that will go down, adding a new temporary chip in the next row,
// removing the temporary chip from the previous row and I set a flag variable to not let me click
// before the chip is on the last possible position.
const animateChipFall = async (endRow, column) => {
  isDropping = true;
  let tempChip = document.createElement("div");
  tempChip.classList.add(turn === player1 ? "player1" : "player2");
  let startCell = document.getElementById(0 + "," + column);

  startCell.appendChild(tempChip);
  let i = 0;
  let interval = setInterval(() => {
    if (i < endRow) {
      // remove chip from current cell
      document.getElementById(i + "," + column).removeChild(tempChip);
      // move to the next cell
      ++i;
      document.getElementById(i + "," + column).appendChild(tempChip);
    } else {
      clearInterval(interval);
      // remove temporary chip from the final cell
      document.getElementById(i + "," + column).removeChild(tempChip);
      // add real chip to the final cell
    }
  }, animationDuration);
  await delay(animationDuration * (endRow + 1));
  isDropping = false;
};

// In this function I check in each cell, in the selected column from bottom to top to find the first empty cell
const returnFirstEmptyCell = (column) => {
  for (let i = ROWS - 1; i >= 0; --i) {
    if (board[i][column] === null) {
      return i;
    }
  }
  return null;
};

// This is main function I which I take the ID from the element that was clicked, I split that ID by the comma and I extract the column number and then I call each function
// I need it to solve the game
const onCellClick = async (event) => {
  if (isDropping || gameOver) return;
  let id = event.target.id;
  let [_, column] = id.split(",");
  column = parseInt(column);

  // step 1 -> check which is the first empty cell
  let row = returnFirstEmptyCell(column);
  if (row === null) {
    return;
  }

  // step 2 -> animate the chip falling into the empty cell1
  await animateChipFall(row, column);

  // step 3 -> put the chip on the empty cell
  writeChip(row, column);

  // // step 4 -> check game status for winners
  let winner = checkWinner();
  if (winner) {
    showWinner(winner);
    gameOver = true;
    return;
  }
  let tie = checkTie();
  if (tie) {
    showTie();
    gameOver = true;
    return;
  }
  changeTurn();
};

// I created the game board with 6 rows and 7 columns and I set an addEventListener
// for when I click on a cell to access the onCellClick function
const ROWS = 6;
const COLS = 7;
let board = [];

const createBoard = () => {
  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
      let cell = document.createElement("div");
      cell.className = "tile";
      board[i][j] = null;
      cell.id = i + "," + j;
      cell.addEventListener("click", onCellClick);

      boardElement.appendChild(cell);
    }
  }
  currentPlayer.innerText = "Turn: " + turn;
};

// The startGame function makes the start button disappear and the game board appears.
const startGame = () => {
  startButton.style.display = "none";
  boardElement.classList.add("board");
  createBoard();
};
