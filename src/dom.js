import Player from './player.js';

function renderShipyard(shipsToPlace, placingPhase = true) {
    const shipyard = document.createElement('div');
    shipyard.id = 'shipyard';
    shipyard.className = 'shipyard-fixed';

    const title = document.createElement('h2');
    title.textContent = 'Ships to place:';
    shipyard.appendChild(title);

    const shipsList = document.createElement('div');
    shipsList.className = 'shipyard-list-vertical';

    if (shipsToPlace.length === 0) {
        
        for (let i = 0; i < 4; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'draggable-ship ship-placeholder';
            
            placeholder.classList.add(window.shipOrientation === 'vertical' ? 'vertical' : 'horizontal');
            for (let j = 0; j < i + 2; j++) {
                const block = document.createElement('span');
                block.className = 'ship-block ship-block-placeholder';
                placeholder.appendChild(block);
            }
            shipsList.appendChild(placeholder);
        }
    } else {
        shipsToPlace.forEach((ship, idx) => {
            const shipEl = document.createElement('div');
            shipEl.className = 'draggable-ship';
            shipEl.draggable = placingPhase;
            shipEl.dataset.length = ship.length;
            shipEl.dataset.idx = idx;
            shipEl.classList.add(window.shipOrientation === 'vertical' ? 'vertical' : 'horizontal');

            for (let i = 0; i < ship.length; i++) {
                const block = document.createElement('span');
                block.className = 'ship-block';
                shipEl.appendChild(block);
            }

            shipEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ length: ship.length, idx }));
            });

            shipsList.appendChild(shipEl);
        });
    }

    shipyard.appendChild(shipsList);

    // Orientation indicator
    const orientationBox = document.createElement('div');
    orientationBox.className = 'orientation-indicator';
    orientationBox.textContent = `Orientation: ${window.shipOrientation === 'horizontal' ? 'Horizontal' : 'Vertical'} (Space to toggle)`;
    shipyard.appendChild(orientationBox);

    return shipyard;
}

function createBoardElement(player, boardName, shipsToPlace = [], placingPhase = true) {
    const boardContainer = document.createElement('div');
    boardContainer.className = 'board-container';

    const boardDiv = document.createElement('div');
    boardDiv.classList.add('gameboard');
    boardDiv.dataset.player = boardName;

    let previewCells = [];

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;

            const shipEntry = player.gameboard.getShips().find(ship =>
                ship.coordinates.some(coord => coord.x === x && coord.y === y)
            );
            const coordObj = shipEntry ? shipEntry.coordinates.find(coord => coord.x === x && coord.y === y) : null;

            if (shipEntry) {
                if (coordObj.hit) {
                    cell.classList.add('hit');
                } else if (boardName === 'player') {
                    cell.classList.add('ship');
                }
            }

            const isMiss = player.gameboard.getMissedAttacks().some(coord => coord.x === x && coord.y === y);
            if (isMiss) {
                cell.classList.add('miss');
            }

            if (placingPhase && shipsToPlace.length > 0 && boardName === 'player') {
                cell.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    // Remove previous preview
                    previewCells.forEach(c => c.classList.remove('ship-placement-preview'));
                    previewCells = [];
                    const rawData = e.dataTransfer.getData('text/plain');
                    if (!rawData) return;
                    const data = JSON.parse(rawData);

                    for (let i = 0; i < data.length; i++) {
                        let targetX = x, targetY = y;
                        if (window.shipOrientation === 'horizontal') {
                            targetX = x + i;
                        } else {
                            targetY = y + i;
                        }
                        if (targetX < 10 && targetY < 10) {
                            const previewCell = boardDiv.querySelector(`.cell[data-x="${targetX}"][data-y="${targetY}"]`);
                            if (previewCell) {
                                previewCell.classList.add('ship-placement-preview');
                                previewCells.push(previewCell);
                            }
                        }
                    }
                });
                cell.addEventListener('dragleave', () => {
                    previewCells.forEach(c => c.classList.remove('ship-placement-preview'));
                    previewCells = [];
                });
                cell.addEventListener('drop', (e) => {
                    e.preventDefault();
                    previewCells.forEach(c => c.classList.remove('ship-placement-preview'));
                    previewCells = [];
                    const rawData = e.dataTransfer.getData('text/plain');
                    if (!rawData) return;
                    const data = JSON.parse(rawData);
                    window.handleShipDrop(x, y, data.length, data.idx);
                });
            }

            if (player.type === 'computer' && !isMiss && (!shipEntry || !coordObj?.hit) && !placingPhase) {
                cell.addEventListener('click', (e) => {
                    if (typeof window.handleAttack === 'function') {
                        window.handleAttack(x, y);
                    }
                });
            }

            boardDiv.appendChild(cell);
        }
    }

    boardContainer.appendChild(boardDiv);

    const shipyard = renderShipyard(
        boardName === 'player' ? shipsToPlace : [],
        placingPhase && boardName === 'player'
    );
    boardContainer.appendChild(shipyard);

    return boardContainer;
}

function renderBoards(player1, player2, shipsToPlace = [], placingPhase = true) {
    const root = document.getElementById('root');
    root.textContent = '';

    const boardsRow = document.createElement('div');
    boardsRow.className = 'boards-row';

    const p1Board = createBoardElement(player1, 'player', shipsToPlace, placingPhase);
    const p2Board = createBoardElement(player2, 'computer', [], placingPhase);

    boardsRow.appendChild(p1Board);
    boardsRow.appendChild(p2Board);

    root.appendChild(boardsRow);
}

export { renderBoards };