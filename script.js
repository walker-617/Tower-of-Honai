var totalDisks = 3;
let pickingTower = null;
const towers = [
  [], // dummy array for mapping tower 1 to element 1 in array
  [], // storing tower 1 disc numbers
  [], // for tower 2
  [], // for tower 3
];

function setGameConatinerHeight() {
  const gameContainerElement = document.getElementById("game-container");
  gameContainerElement.style.height = `${(totalDisks + 1) * 25}px`;
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
  towers[1].length = 0;
  towers[2].length = 0;
  towers[3].length = 0;
}

function createInitialTowers() {
  for (let i = 0; i <= totalDisks; i++) {
    towers.push([]);
  }
  for (let i = totalDisks; i >= 1; i--) {
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

function initializeGame() {
  pickingTower = null;
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

function displayMessage(message) {
  const moveInfoElement = document.getElementById("move-info");
  moveInfoElement.textContent = message;
}

function handleTowerClick(towerId) {
  if (pickingTower === null) {
    if (towers[towerId].length === 0) {
      // selected tower is empty, should pick another tower
      return;
    }
    // setting picking tower and disabling it
    pickingTower = towerId;
    changeOpacityOfTower(pickingTower, 0.5);
    displayMessage("Please select other tower to drop the disc");
  } else if (pickingTower !== towerId) {
    // if the picking tower is set and he selects other tower to drop
    const droppingTower = towerId;
    // check if it is valide move or not
    if (isValidMove(pickingTower, droppingTower)) {
      const poppedDiskNumber = popFromTower(pickingTower);
      updateTowerDisks(pickingTower);

      pushToTower(droppingTower, poppedDiskNumber);
      updateTowerDisks(droppingTower);

      changeOpacityOfTower(pickingTower, 1);
      pickingTower = null;
    }
  } else {
    // if the user is clicking on the same tower
  }
}

initializeGame();
