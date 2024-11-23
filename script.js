let totalDisks = 1;
let pickingTower = null;
const towers = [
  [], // dummy array for mapping tower 1 to element 1 in array and also used after winning
  [], // storing tower 1 disc numbers
  [], // for tower 2
  [], // for tower 3
];
const numOfDiscsPossible = [1, 2, 3, 4, 5, 6, 7];
let totalMoves = 0;

function setGameConatinerHeight() {
  const gameContainerElement = document.getElementById("game-container");
  gameContainerElement.style.height = `${(totalDisks + 1) * 25}px`;

  const winGameContainerElement = document.getElementById("win-game-container");
  winGameContainerElement.style.height = `${(totalDisks + 1) * 25}px`;
}

function createDisk(diskNumber) {
  const diskElement = document.createElement("div");
  diskElement.classList.add("disk");
  diskElement.id = `disk-${diskNumber}`;
  diskElement.textContent = diskNumber;
  diskElement.style.width = `${diskNumber * 50}px`;
  return diskElement;
}

function updateTowerDisks(towerId) {
  const towerDisks = towers[towerId];
  const towerElement = document.getElementById(`tower-${towerId}`);
  towerElement.innerHTML = "";
  for (let i = towerDisks.length - 1; i >= 0; i--) {
    const diskNumber = towerDisks[i];
    const diskElement = createDisk(diskNumber);
    towerElement.appendChild(diskElement);
  }
}

function clearAllTowers() {
  towers[0].length = 0;
  towers[1].length = 0;
  towers[2].length = 0;
  towers[3].length = 0;
}

function createInitialTowers() {
  for (let i = 0; i <= totalDisks; i++) {
    towers.push([]);
  }
  for (let i = totalDisks; i >= 1; i--) {
    towers[0].push(i);
    towers[1].push(i);
  }
}

function handleNumOfDiscsClick(numOfDiscs) {
  totalDisks = numOfDiscs;
  initializeGame();
}

function setBaseWidth() {
  const bases = document.querySelectorAll(".base");
  bases.forEach((base) => {
    base.style.width = `${totalDisks * 50 + 20}px`;
  });
}

function updateNumOfDisksButtons(totalDisks) {
  numOfDiscsPossible.forEach((num) => {
    const y = document.getElementById(`${num}-discs`);
    y.style.backgroundColor = "white";
    y.style.color = "black";
    if (num === totalDisks) {
      y.style.backgroundColor = "black";
      y.style.color = "white";
    }
  });
}

function initializeGame() {
  pickingTower = null;
  totalMoves = 0;
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.display = "flex";
  const winGameContainer = document.getElementById("win-game-container");
  winGameContainer.style.display = "none";
  changeOpacityOfTower(1, 1);
  changeOpacityOfTower(2, 1);
  changeOpacityOfTower(3, 1);
  updateNumOfDisksButtons(totalDisks);
  setGameConatinerHeight();
  setBaseWidth();
  clearAllTowers();
  createInitialTowers();
  updateTowerDisks(1);
  updateTowerDisks(2);
  updateTowerDisks(3);
}

function popFromTower(towerId) {
  const towerDisks = towers[towerId];
  return towerDisks.pop();
}

function pushToTower(towerId, diskNumber) {
  const towerDisks = towers[towerId];
  towerDisks.push(diskNumber);
}

function changeOpacityOfTower(towerId, opacity) {
  document.getElementById(`tower-container-${towerId}`).style.opacity = opacity;
}

function isValidMove(fromTowerId, toTowerId) {
  const fromTowerDisks = towers[fromTowerId];
  const toTowerDisks = towers[toTowerId];
  if (toTowerDisks.length === 0) {
    return true;
  }
  return fromTowerDisks.at(-1) < toTowerDisks.at(-1);
}

function displayMessage(message = "", color = "black") {
  const moveInfoElement = document.getElementById("move-info");
  moveInfoElement.textContent = message;
  moveInfoElement.style.color = color;
  setTimeout(() => {
    moveInfoElement.textContent = "";
    moveInfoElement.style.color = "white";
  }, 3000);
}

function isWin() {
  return towers[3].length === totalDisks;
}

function handleTowerClick(towerId) {
  if (pickingTower === null) {
    if (towers[towerId].length === 0) {
      // condition where he clicks empty tower
      displayMessage("Tower is empty. Please select other tower.", "red");
    } else {
      // setting picking tower and disabling it
      pickingTower = towerId;
      changeOpacityOfTower(pickingTower, 0.5);
    }
  } else if (pickingTower !== towerId) {
    // if the picking tower is set and he selects other tower to drop
    // check if it is valide move or not
    if (isValidMove(pickingTower, towerId)) {
      const droppingTower = towerId;

      const poppedDiskNumber = popFromTower(pickingTower);
      updateTowerDisks(pickingTower);

      pushToTower(droppingTower, poppedDiskNumber);
      updateTowerDisks(droppingTower);

      totalMoves = totalMoves + 1;
      changeOpacityOfTower(pickingTower, 1);
      pickingTower = null;
      if (isWin()) {
        const gameContainer = document.getElementById("game-container");
        gameContainer.style.display = "none";

        const winGameContainer = document.getElementById("win-game-container");
        winGameContainer.style.display = "flex";

        const numOfMovesElement = document.getElementById("num-of-moves");
        numOfMovesElement.textContent = totalMoves;

        const minMovesElement = document.getElementById("min-moves");
        minMovesElement.textContent = 2 ** totalDisks - 1;

        updateTowerDisks(0);

        if (totalMoves === 2 ** totalDisks - 1) {
          displayMessage(
            "Congratulations! You have completed the game in " +
              totalMoves +
              " moves",
            "green"
          );
        }

        totalMoves = 0;
      }
    } else {
      displayMessage("Invalid move. Please select other tower.", "red");
    }
  } else {
    // if the user is clicking on the same tower
    pickingTower = null;
    changeOpacityOfTower(towerId, 1);
  }
}

initializeGame();
