import Player from './player.js';

function createBoardElement(player, boardName) {
    const boardDiv = document.createElement('div');
    boardDiv.classList.add('gameboard');
    boardDiv.dataset.player = boardName;

    // 10 X 10 board
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;

            const shipEntry = player.gameboard.getShips().find(ship => 
                ship.coordinates.some(coord => coord.x === x && coord.y === y)
            );

            const coordObj = shipEntry ? shipEntry.coordinates.find(coord => coord.x === x && coord.y === y): null;
            
            if (shipEntry) {
                const coordObj = shipEntry.coordinates.find(coord => coord.x === x && coord.y === y);
                if (coordObj.hit) {
                    cell.classList.add('hit');
                } else {
                    cell.classList.add('ship');
                }
            }

            const isMiss = player.gameboard.getMissedAttacks().some(coord => coord.x === x && coord.y === y);
            if (isMiss) {
                cell.classList.add('miss');
            }

            if (player.type === 'computer' && !isMiss && (!shipEntry || !coordObj?.hit)) {
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

function renderBoards(player1, player2) {
    const root = document.getElementById('root');
    root.innerHTML = '';

    const p1Board = createBoardElement(player1, 'player');
    const p2Board = createBoardElement(player2, 'computer');

    root.appendChild(p1Board);
    root.appendChild(p2Board);
}

export { renderBoards };