import Ship from './ship.js';

export default function Gameboard() {
    const ships = [];
    const missedAttacks = [];

    function placeShip(ship, coordinates) {
        ships.push({ ship, coordinates });
    }

    function receiveAttack(x, y) {
        for (let s of ships) {
            if (s.coordinates.some(coord => coord.x === x && coord.y === y)) {
                s.ship.hit();
                return true;
            }
        }

        if (!missedAttacks.some(coord => coord.x === x && coord.y === y)) {
            missedAttacks.push({ x, y });
        }
        return false;
    }

    function getMissedAttacks() {
        return missedAttacks.slice();
    }

    function allShipsSunk() {
        if (ships.length === 0) {
            return false;
        }
        return ships.every(entry => entry.ship.isSunk());
    }

    // testing
    function getShips() {
        return ships.map(s => ({
            ship: s.ship,
            coordinates: s.coordinates
        }));
    }

    return { placeShip, receiveAttack, getMissedAttacks, allShipsSunk, getShips };
}