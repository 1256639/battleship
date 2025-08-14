import Player from './player.js';

function renderShipyard(shipsToPlace) {
    const shipyard = document.createElement('div');
    shipyard.id = 'shipyard';

    const title = document.createElement('h2');
    title.textContent = 'Ships to place:';
    shipyard.appendChild(title);

    const shipsList = document.createElement('div');
    shipsList.className = 'shipyard-list';

    shipsToPlace.forEach((ship, idx) => {
        const shipEl = document.createElement('div');
        shipEl.className = 'draggable-ship';
        shipEl.draggable = true;
        shipEl.dataset.length = ship.length;
        shipEl.dataset.idx = idx;

        // Render green squares
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

    shipyard.appendChild(shipsList);
    return shipyard;
}

function createBoardElement(player, boardName, allowDrop = false) {
    const boardDiv = document.createElement('div');
    boardDiv.classList.add('gameboard');
    boardDiv.dataset.player = boardName;

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

            // Friendly ships rendered as green squares
            if (boardName === 'player' && shipEntry) {
                if (coordObj.hit) {
                    cell.classList.add('hit');
                } else {
                    cell.classList.add('ship');
                }
            }

            // Do NOT show ships for computer
            const isMiss = player.gameboard.getMissedAttacks().some(coord => coord.x === x && coord.y === y);
            if (isMiss) {
                cell.classList.add('miss');
            }

            // Allow dropping ships on player board
            if (allowDrop) {
                cell.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    cell.classList.add('ship-preview');
                });
                cell.addEventListener('dragleave', () => {
                    cell.classList.remove('ship-preview');
                });
                cell.addEventListener('drop', (e) => {
                    e.preventDefault();
                    cell.classList.remove('ship-preview');
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    window.handleShipDrop(x, y, data.length, data.idx);
                });
            }

            if (player.type === 'computer' && !isMiss && (!shipEntry || !coordObj?.hit) && !allowDrop) {
                cell.addEventListener('click', (e) => {
                    if (typeof window.handleAttack === 'function') {
                        window.handleAttack(x, y);
                    }
                });
            }

            boardDiv.appendChild(cell);
        }
    }
    return boardDiv;
}

function renderBoards(player1, player2, shipsToPlace = [], placingPhase = true) {
    const root = document.getElementById('root');
    root.textContent = '';

    const p1Board = createBoardElement(player1, 'player', placingPhase && shipsToPlace.length > 0);
    const p2Board = createBoardElement(player2, 'computer', false);

    root.appendChild(p1Board);
    root.appendChild(p2Board);

    if (placingPhase && shipsToPlace.length > 0) {
        const shipyard = renderShipyard(shipsToPlace);
        root.appendChild(shipyard);
    }
}

export { renderBoards };