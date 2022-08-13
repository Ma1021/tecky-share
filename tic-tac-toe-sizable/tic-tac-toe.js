// NOT recommended: can find out the container(currentTarget) was clicked
// NOT recommended: then make changes on which box(target) was clicked

// use var so could change if designer would like to change
let circle = "bi-circle";
let cross = "bi-x-lg";

let gameOver = false;
let playerX = document.querySelector(".player-turn.player-x");
let playerO = document.querySelector(".player-turn.player-o");
const showTurn = document.querySelector(".showTurn span");

let turn = 0;

let boxRowNumDecide = 0;
while (0 >= boxRowNumDecide || !boxRowNumDecide || boxRowNumDecide > 10) {
  boxRowNumDecide = window.prompt(
    "Choose number of boxes in a row (less than 10):"
  );
  console.log(boxRowNumDecide);
}
// let boxRowNumDecide = 5;

let boxContainer = document.querySelector(".tic-background .container");
boxContainer.innerHTML = "";
for (let makeBox = 0; makeBox < Math.pow(boxRowNumDecide, 2); makeBox++) {
  boxContainer.innerHTML = boxContainer.innerHTML + `<div class="box"></div>`;
}
boxContainer.style.width = `calc(75px * ${boxRowNumDecide} + 5px * ${boxRowNumDecide})`;
// console.log(boxContainer);
const boxes = document.querySelectorAll(".box");
// console.log(boxes);

// map the cell of the box
let map = [];
// mapping the box into [ [], [], [] ] array
for (let row = 0; row < boxRowNumDecide; row++) {
  map[row] = [];
  // console.log(`map ${row}: ${map[row]}`);
  // column = 3
  for (let col = 0; col < boxRowNumDecide; col++) {
    map[row][col] = boxes[row * boxRowNumDecide + col];
    // console.log(`map ${(row, col)}: ${map[row][col]}`);
  }
}

// console.log(map);
// adding event listener into the box
for (let box of boxes) {
  box.addEventListener(
    "click",
    function (event) {
      // run while game is not done
      if (event.currentTarget.className == "box") {
        // see when js check the game over
        if (!gameOver) {
          // let circle and cross take turn
          // circle always first

          if (turn % 2 == 0) {
            box.classList.add("circle");
            box.innerHTML = `<i class='bi ${circle}'></i>`;
            showTurn.innerHTML = `<i class='bi ${cross}'></i> Turn`;
            playerX.classList.add("current");
            playerO.classList.remove("current");
            turn += 1;
            gameOver = checkWinner(box, "circle");
            // when draw
            checkDraw();
            // when the game is really over
            if (gameOver) {
              showTurn.innerHTML = `<i class='bi ${circle}'></i> Win`;
              showTurn.classList.add("result");
              document.querySelector(".current").classList.remove("current");
              let score = document.querySelector("#player-o-score");
              if (score.innerHTML === "-") {
                document.querySelector("#player-o-score").innerHTML = 1;
              } else {
                score.innerHTML = parseInt(score.innerHTML) + 1;
              }
            }
          } else {
            box.classList.add("cross");
            box.innerHTML = `<i class='bi ${cross}'></i>`;
            showTurn.innerHTML = `<i class='bi ${circle}'></i> Turn`;
            playerO.classList.add("current");
            playerX.classList.remove("current");
            turn += 1;
            gameOver = checkWinner(box, "cross");
            // when draw
            checkDraw();
            // when the game is really over
            if (gameOver) {
              showTurn.innerHTML = `<i class='bi ${cross}'></i> Win`;
              showTurn.classList.add("result");
              document.querySelector(".current").classList.remove("current");
              let score = document.querySelector("#player-x-score");
              if (score.innerHTML === "-") {
                document.querySelector("#player-x-score").innerHTML = 1;
              } else {
                score.innerHTML = parseInt(score.innerHTML) + 1;
              }
            }
          }
        }
      }
    },
    false
  );
}

function checkWinner(selectedBox, player) {
  // get the coordinate of the selectedBox in the map
  let xAxis;
  let yAxis;
  for (let y = 0; y < boxRowNumDecide; y++) {
    if (map[y].indexOf(selectedBox) !== -1) {
      yAxis = map[y].indexOf(selectedBox);
      xAxis = map.indexOf(map[y]);
      // console.log(xAxis, yAxis);
    }
  }
  // check if the x, y axis all get the same class
  // console.log(boxRowNumDecide);
  let rowWin = checkRow(xAxis, yAxis, player);
  let columnWin = checkColumn(xAxis, yAxis, player);
  let rightTopSlopeWin = checkRightTopSlope(player);
  let leftTopSlopeWin = checkLeftTopSlope(player);

  if (xAxis + yAxis == boxRowNumDecide - 1) {
    console.log("console top slope win:", checkRightTopSlope(player));
  }
  if (xAxis == yAxis) {
    console.log("left top slope win:", checkLeftTopSlope(player));
  }

  if (
    rowWin ||
    columnWin ||
    // below two only work when the clicked box is inside the slope
    (xAxis + yAxis == boxRowNumDecide - 1
      ? rightTopSlopeWin
        ? true
        : false
      : false) ||
    (xAxis == yAxis ? (leftTopSlopeWin ? true : false) : false)
  ) {
    return true;
  }
}

function checkRow(xAxis, yAxis, player) {
  let win = true;
  for (let row = 0; row < boxRowNumDecide; row++) {
    // console.log("enter the loop row");
    if (!map[xAxis][row].classList.contains(player)) {
      // console.log("here has class:", map[xAxis][row]);
      win = false;
    }
  }
  if (win) {
    for (let row = 0; row < boxRowNumDecide; row++) {
      map[xAxis][row].classList.add("winningBox");
    }
    return true;
  }
  return false;
}

function checkColumn(xAxis, yAxis, player) {
  for (let column = 0; column < boxRowNumDecide; column++) {
    if (!map[column][yAxis].classList.contains(player)) {
      return false;
    }
  }
  for (let column = 0; column < boxRowNumDecide; column++) {
    map[column][yAxis].classList.add("winningBox");
  }
  return true;
}

function checkRightTopSlope(player) {
  // check if it is in the slope (/)
  for (let i = 0; i < boxRowNumDecide; i++) {
    // any one in slope do not have player
    if (!map[i][boxRowNumDecide - 1 - i].classList.contains(player)) {
      return false;
    }
  }
  for (let i = 0; i < boxRowNumDecide; i++) {
    // any one in slope do not have player
    map[i][boxRowNumDecide - 1 - i].classList.add("winningBox");
  }

  return true;
}

function checkLeftTopSlope(player) {
  // check if it is in the slope (\)
  // console.log("enter check left top slope");
  for (let i = 0; i < boxRowNumDecide; i++) {
    // console.log("where is the map", map[i][i]);
    // console.log("class list", map[i][i].classList);
    if (!map[i][i].classList.contains(player)) {
      return false;
    }
  }
  for (let i = 0; i < boxRowNumDecide; i++) {
    map[i][i].classList.add("winningBox");
  }
  return true;
}

function checkDraw() {
  if (turn == boxes.length) {
    showTurn.innerHTML = `Draw`;
    showTurn.classList.add("result");
    document.querySelector(".current").classList.remove("current");
  }
}

// when restart was clicked
let restart = document.querySelector("button#restart");
restart.addEventListener("click", function (event) {
  turn = 0;
  gameOver = false;
  for (let box of boxes) {
    box.className = "box";
    box.innerHTML = "";
  }
  showTurn.innerHTML = "Start your game!";
  showTurn.classList.remove("result");
});
