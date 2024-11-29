let totalDisks = 1;
let selectedTower = null;
const towers = [[], [], [], []]; // 0: dummy, 1-3: game towers
const possibleDiskCounts = [1, 2, 3, 4, 5, 6, 7];
let moveCount = 0;
let startTime = null;

// UI Helpers
function setElementHeightById(elementId, height) {
  const element = document.getElementById(elementId);
  element.style.height = `${height}px`;
}

function setElementDisplayById(elementId, displayStyle) {
  const element = document.getElementById(elementId);
  element.style.display = displayStyle;
}

function createDiskElement(diskNumber) {
  const disk = document.createElement("div");
  disk.classList.add("disk");
  disk.id = `disk-${diskNumber}`;
  disk.textContent = diskNumber;
  disk.style.width = `${diskNumber * 50}px`;
  return disk;
}

function updateTowerUI(towerId) {
  const tower = document.getElementById(`tower-${towerId}`);
  tower.innerHTML = "";
  const disks = towers[towerId];
  disks
    .slice()
    .reverse()
    .forEach((diskNumber) => {
      tower.appendChild(createDiskElement(diskNumber));
    });
}

function setBaseWidths() {
  const bases = document.querySelectorAll(".base");
  bases.forEach((base) => {
    base.style.width = `${totalDisks * 50 + 20}px`;
  });
}

function updateDiskSelectionButtons() {
  possibleDiskCounts.forEach((count) => {
    const button = document.getElementById(`${count}-discs`);
    const isSelected = count === totalDisks;
    button.style.backgroundColor = isSelected ? "black" : "white";
    button.style.color = isSelected ? "white" : "black";
  });
}

function displayTemporaryMessage(message, color = "black", duration = 3000) {
  const moveInfo = document.getElementById("move-info");
  moveInfo.textContent = message;
  moveInfo.style.color = color;
  setTimeout(() => {
    moveInfo.textContent = "";
    moveInfo.style.color = "white";
  }, duration);
}

function updateAllTowersUI() {
  for (let i = 0; i <= 3; i++) {
    updateTowerUI(i);
  }
}

function setTowerOpacity(towerId, opacity) {
  document.getElementById(`tower-container-${towerId}`).style.opacity = opacity;
}

function setAllTowersOpacity(opacity) {
  for (let i = 1; i <= 3; i++) {
    setTowerOpacity(i, opacity);
  }
}

// Game Logic
function resetTowers() {
  towers[0] = [];
  towers[1] = [];
  towers[2] = [];
  towers[3] = [];
}

function initializeTowers() {
  resetTowers();
  for (let i = totalDisks; i >= 1; i--) {
    towers[0].push(i);
    towers[1].push(i);
  }
}

function isValidMove(fromTower, toTower) {
  if (towers[toTower].length === 0) return true;
  return towers[fromTower].at(-1) < towers[toTower].at(-1);
}

function isGameWon() {
  return towers[3].length === totalDisks;
}

function handleTowerClick(towerId) {
  if (!startTime) startTime = new Date();

  if (selectedTower === null) {
    if (towers[towerId].length === 0) {
      displayTemporaryMessage(
        "Tower is empty. Please select another tower.",
        "red"
      );
    } else {
      selectedTower = towerId;
      setTowerOpacity(selectedTower, 0.5);
    }
  } else if (selectedTower !== towerId) {
    if (isValidMove(selectedTower, towerId)) {
      const disk = towers[selectedTower].pop();
      towers[towerId].push(disk);

      updateTowerUI(selectedTower);
      updateTowerUI(towerId);

      moveCount++;
      setTowerOpacity(selectedTower, 1);
      selectedTower = null;

      if (isGameWon()) endGame();
    } else {
      displayTemporaryMessage(
        "Invalid move. Please select another tower.",
        "red"
      );
    }
  } else {
    selectedTower = null;
    setTowerOpacity(towerId, 1);
  }
}

function endGame() {
  setElementDisplayById("game-container", "none");
  setElementDisplayById("win-game-container", "flex");

  document.getElementById("num-of-moves").textContent = moveCount;
  document.getElementById("min-moves").textContent = 2 ** totalDisks - 1;
  document.getElementById("time-taken").textContent = (
    (new Date() - startTime) /
    1000
  ).toFixed(2);

  if (moveCount === 2 ** totalDisks - 1) {
    displayTemporaryMessage(
      "Perfect game! Completed in minimum moves.",
      "green"
    );
  }

  moveCount = 0;
}

// Initialization and Event Handlers
function initializeGame() {
  selectedTower = null;
  moveCount = 0;
  startTime = null;

  setElementDisplayById("game-container", "flex");
  setElementDisplayById("win-game-container", "none");
  setAllTowersOpacity(1);

  updateDiskSelectionButtons();
  setElementHeightById("game-container", (totalDisks + 1) * 25);
  setElementHeightById("win-game-container", (totalDisks + 1) * 25);

  setBaseWidths();
  initializeTowers();
  updateAllTowersUI();
}

function handleDiskCountSelection(diskCount) {
  totalDisks = diskCount;
  initializeGame();
}

// Event Listeners
document
  .getElementById("restart-button")
  .addEventListener("click", initializeGame);

document
  .getElementById("num-of-discs-container")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("discs-values")) {
      handleDiskCountSelection(parseInt(event.target.dataset.value));
    }
  });

document.getElementById("game-container").addEventListener("click", (event) => {
  const towerElement = event.target.closest(".tower-container");
  if (towerElement) {
    handleTowerClick(parseInt(towerElement.dataset.towerId));
  }
});

document.addEventListener("keydown", (event) => {
  const keyMap = { 1: 1, 2: 2, 3: 3 };
  if (keyMap[event.key]) {
    handleTowerClick(keyMap[event.key]);
  } else if (event.key === "r") {
    initializeGame();
  }
});

initializeGame();
