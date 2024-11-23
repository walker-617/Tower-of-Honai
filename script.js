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
let startTime = null;

function setGameContainerHeight() {
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
  towers[0] = [];
  towers[1] = [];
  towers[2] = [];
  towers[3] = [];
}

function createInitialTowers() {
  for (let i = totalDisks; i >= 1; i--) {
    towers[0].push(i);
    towers[1].push(i);
  }
  towers[2] = [];
  towers[3] = [];
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
    const button = document.getElementById(`${num}-discs`);
    button.style.backgroundColor = "white";
    button.style.color = "black";
    if (num === totalDisks) {
      button.style.backgroundColor = "black";
      button.style.color = "white";
    }
  });
}

function initializeGame() {
  pickingTower = null;
  totalMoves = 0;
  startTime = null;
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.display = "flex";
  const winGameContainer = document.getElementById("win-game-container");
  winGameContainer.style.display = "none";
  setOpacityForAllTowers(1);
  updateNumOfDisksButtons(totalDisks);
  setGameContainerHeight();
  setBaseWidth();
  clearAllTowers();
  createInitialTowers();
  updateAllTowers();
}

function popFromTower(towerId) {
  return towers[towerId].pop();
}

function pushToTower(towerId, diskNumber) {
  towers[towerId].push(diskNumber);
}

function setOpacityForAllTowers(opacity) {
  for (let i = 1; i <= 3; i++) {
    changeOpacityOfTower(i, opacity);
  }
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
  if (startTime === null) {
    startTime = new Date();
  }
  if (pickingTower === null) {
    if (towers[towerId].length === 0) {
      displayMessage("Tower is empty. Please select other tower.", "red");
    } else {
      pickingTower = towerId;
      changeOpacityOfTower(pickingTower, 0.5);
    }
  } else if (pickingTower !== towerId) {
    if (isValidMove(pickingTower, towerId)) {
      const poppedDiskNumber = popFromTower(pickingTower);
      updateTowerDisks(pickingTower);

      pushToTower(towerId, poppedDiskNumber);
      updateTowerDisks(towerId);

      totalMoves += 1;
      changeOpacityOfTower(pickingTower, 1);
      pickingTower = null;

      if (isWin()) {
        const gameContainer = document.getElementById("game-container");
        gameContainer.style.display = "none";

        const winGameContainer = document.getElementById("win-game-container");
        winGameContainer.style.display = "flex";

        document.getElementById("num-of-moves").textContent = totalMoves;
        document.getElementById("min-moves").textContent = 2 ** totalDisks - 1;
        document.getElementById("time-taken").textContent =
          Math.round(((new Date() - startTime) / 1000) * 100) / 100;

        updateTowerDisks(0);

        if (totalMoves === 2 ** totalDisks - 1) {
          displayMessage(
            "Congratulations! You have completed the game in minimum moves",
            "green"
          );
        }

        totalMoves = 0;
      }
    } else {
      displayMessage("Invalid move. Please select other tower.", "red");
    }
  } else {
    pickingTower = null;
    changeOpacityOfTower(towerId, 1);
  }
}

function updateAllTowers() {
  for (let i = 1; i <= 3; i++) {
    updateTowerDisks(i);
  }
}

document
  .getElementById("restart-button")
  .addEventListener("click", initializeGame);

document
  .getElementById("num-of-discs-container")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("discs-values")) {
      handleNumOfDiscsClick(parseInt(event.target.dataset.value));
    }
  });

document.getElementById("game-container").addEventListener("click", (event) => {
  const tower = event.target.closest(".tower-container");
  if (tower) {
    handleTowerClick(parseInt(tower.dataset.towerId));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "1") {
    handleTowerClick(1);
  } else if (event.key === "2") {
    handleTowerClick(2);
  } else if (event.key === "3") {
    handleTowerClick(3);
  } else if (event.key === "r") {
    initializeGame();
  }
});

initializeGame();
