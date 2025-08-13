import Player from './player.js';
import { renderBoards } from './dom.js';
import Ship from './ship.js';
import './style.css';

const player = Player('human');
const computer = Player('computer');

// Demo
player.gameboard.placeShip({ ...Ship(2) }, [{ x:0, y:0 }, { x:1, y:0 }]);
computer.gameboard.placeShip({ ...Ship(2) }, [{ x:0, y:0 }, { x:1, y:0 }]);

let playerTurn = true;

window.handleAttack = function(x, y) {
    if (!playerTurn) return;

    const result = computer.gameboard.receiveAttack(x, y);
    renderBoards(player, computer);

    if (computer.gameboard.allShipsSunk()) {
        alert('You win!');
        return;
    }

    playerTurn = false;
    setTimeout(() => {
        // Computer makes a random legal move
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
        renderBoards(player, computer);

        if (player.gameboard.allShipsSunk()) {
            alert('Computer wins!');
            return;
        }
        playerTurn = true;
    }, 500);
};

renderBoards(player, computer);