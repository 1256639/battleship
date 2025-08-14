import Player from './player.js';
import { renderBoards } from './dom.js';
import Ship from './ship.js';
import './style.css';

const shipSizes = [2, 3, 4, 5];
let player, computer, shipsToPlace, placingPhase, playerTurn;
let shipOrientation = 'horizontal'; 

window.shipOrientation = shipOrientation; 

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        shipOrientation = (shipOrientation === 'horizontal') ? 'vertical' : 'horizontal';
        window.shipOrientation = shipOrientation; 
    }
});

function resetGame() {
    player = Player('human');
    computer = Player('computer');
    shipsToPlace = shipSizes.map(size => Ship(size));
    placingPhase = true;
    playerTurn = true;
    shipOrientation = 'horizontal';
    window.shipOrientation = shipOrientation;
    placeComputerShips();
    renderBoards(player, computer, shipsToPlace, placingPhase);
}

function placeComputerShips() {
    const placedCoords = [];
    shipSizes.forEach(size => {
        let placed = false;
        while (!placed) {
            const horizontal = Math.random() > 0.5;
            let x, y, coords;
            if (horizontal) {
                x = Math.floor(Math.random() * (10 - size + 1));
                y = Math.floor(Math.random() * 10);
                coords = Array.from({ length: size }, (_, i) => ({ x: x + i, y }));
            } else {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * (10 - size + 1));
                coords = Array.from({ length: size }, (_, i) => ({ x, y: y + i }));
            }
            // Check overlap
            if (!coords.some(coord =>
                placedCoords.some(existing =>
                    existing.x === coord.x && existing.y === coord.y
                )
            )) {
                computer.gameboard.placeShip(Ship(size), coords);
                placedCoords.push(...coords);
                placed = true;
            }
        }
    });
}

window.handleShipDrop = function(x, y, length, idx) {
    let coords = [];
    for (let i = 0; i < length; i++) {
        let cx = x, cy = y;
        if (window.shipOrientation === 'horizontal') {
            cx = x + i;
        } else {
            cy = y + i;
        }
        coords.push({ x: cx, y: cy });
    }
    // Bounds check
    if (coords.some(c => c.x >= 10 || c.y >= 10)) return;
    // Overlap check
    const occupied = player.gameboard.getShips().some(ship =>
        ship.coordinates.some(coord =>
            coords.some(c => c.x === coord.x && c.y === coord.y)
        )
    );
    if (occupied) return;
    player.gameboard.placeShip(Ship(length), coords);
    shipsToPlace.splice(idx, 1);
    if (shipsToPlace.length === 0) placingPhase = false;
    renderBoards(player, computer, shipsToPlace, placingPhase);
};

window.handleAttack = function(x, y) {
    if (placingPhase || !playerTurn) return;

    const result = computer.gameboard.receiveAttack(x, y);
    renderBoards(player, computer, shipsToPlace, placingPhase);

    if (computer.gameboard.allShipsSunk()) {
        setTimeout(() => {
            alert('You win!');
            resetGame();
        }, 300);
        return;
    }

    playerTurn = false;
    setTimeout(() => {
        let move;
        do {
            move = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
        } while (
            player.gameboard.getMissedAttacks().some(m => m.x === move.x && m.y === move.y) ||
            player.gameboard.getShips().some(ship =>
                ship.coordinates.some(coord => coord.x === move.x && coord.y === move.y && ship.ship.isSunk())
            )
        );
        player.gameboard.receiveAttack(move.x, move.y);
        renderBoards(player, computer, shipsToPlace, placingPhase);

        if (player.gameboard.allShipsSunk()) {
            setTimeout(() => {
                alert('Computer wins!');
                resetGame();
            }, 300);
            return;
        }
        playerTurn = true;
    }, 500);
};

resetGame();