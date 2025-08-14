import Player from './player.js';
import { renderBoards } from './dom.js';
import Ship from './ship.js';
import './style.css';

let player, computer, shipsToPlace, placingPhase, playerTurn;

function resetGame() {
    player = Player('human');
    computer = Player('computer');
    shipsToPlace = [Ship(2)];
    placingPhase = true;
    playerTurn = true;
    placeComputerShip();
    renderBoards(player, computer, shipsToPlace, placingPhase);
}

function placeComputerShip() {
    const shipLen = 2;
    const horizontal = Math.random() > 0.5;
    let x, y;
    if (horizontal) {
        x = Math.floor(Math.random() * (10 - shipLen + 1));
        y = Math.floor(Math.random() * 10);
        computer.gameboard.placeShip(Ship(2), [{x, y}, {x: x+1, y}]);
    } else {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * (10 - shipLen + 1));
        computer.gameboard.placeShip(Ship(2), [{x, y}, {x, y: y+1}]);
    }
}

window.handleShipDrop = function(x, y, length, idx) {
    if (x + length > 10) return;

    const occupied = player.gameboard.getShips().some(ship =>
        ship.coordinates.some(coord =>
            coord.x >= x && coord.x < x + length && coord.y === y
        )
    );
    if (occupied) return;

    player.gameboard.placeShip(Ship(length), [
        ...Array(length).keys()
    ].map(i => ({ x: x + i, y })));

    shipsToPlace.splice(idx, 1);

    if (shipsToPlace.length === 0) placingPhase = false;
    renderBoards(player, computer, shipsToPlace, placingPhase);
};

window.handleAttack = function(x, y) {
    if (placingPhase || !playerTurn) return;

    const result = computer.gameboard.receiveAttack(x, y);
    renderBoards(player, computer, shipsToPlace, placingPhase);

    if (computer.gameboard.allShipsSunk()) {
        alert('You win!');
        resetGame();
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
            alert('Computer wins!');
            resetGame();
            return;
        }
        playerTurn = true;
    }, 500);
};

resetGame();