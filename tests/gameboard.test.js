import Ship from '../src/ship.js';
import Gameboard from '../src/gameboard.js'

describe('Gameboard', () => {
    test('can place a ship at specific coordinates', () => {
        const board = Gameboard();
        const ship = Ship(3);
        board.placeShip(ship, [{ x:0, y:0 }, { x:1, y:0 }, { x:2, y:0 }]);
        const ships = board.getShips();
        expect(ships.length).toBe(1);
        expect(ships[0].coordinates).toEqual([{ x:0, y:0 }, { x:1, y:0 }, { x:2, y:0 }]);
        expect(ships[0].ship).toBe(ship);
    });

    test('receiveAttack hits the correct ship and calls ship.hit()', () => {
        const board = Gameboard();
        const ship = Ship(2);
        board.placeShip(ship, [{ x: 0, y:0 }, {x:1, y:0 }]);
        expect(ship.getHits()).toBe(0);
        const result = board.receiveAttack(1, 0);
        expect(result).toBe(true);
        expect(ship.getHits()).toBe(1);
    });

    test('receiveAttack records missed attacks', () => {
        const board = Gameboard();
        const ship = Ship(2);
        board.placeShip(ship, [{ x:0, y:0 }, {x:1, y:0 }]);
        const result = board.receiveAttack(5, 5);
        expect(result).toBe(false);
        expect(board.getMissedAttacks()).toEqual([{ x:5, y:5 }]);
    });

    test('missed attacks are not duplicated', () => {
        const board = Gameboard();
        board.receiveAttack(3, 3);
        board.receiveAttack(3, 3);
        expect(board.getMissedAttacks()).toEqual([{ x:3, y:3 }]);
    });

    test('allShipsSunk is false if not all ships are sunk', () => {
        const board = Gameboard();
        const ship1 = Ship(2);
        const ship2 = Ship(1);
        board.placeShip(ship1, [{ x:0, y:0}, { x:1, y:0 }]);
        board.placeShip(ship2, [{ x:2, y:0}]);
        board.receiveAttack(0, 0);
        board.receiveAttack(1, 0);
        expect(ship1.isSunk()).toBe(true);
        expect(ship2.isSunk()).toBe(false);
        expect(board.allShipsSunk()).toBe(false);
    });

    test('allShipsSunk is true if all ships are sunk', () => {
        const board = Gameboard();
        const ship1 = Ship(2);
        const ship2 = Ship(1);
        board.placeShip(ship1, [{ x:0, y:0}, { x:1, y:0 }]);
        board.placeShip(ship2, [{ x:2, y:0}]);
        board.receiveAttack(0, 0);
        board.receiveAttack(1, 0);
        board.receiveAttack(2, 0);
        expect(ship1.isSunk()).toBe(true);
        expect(ship2.isSunk()).toBe(true);
        expect(board.allShipsSunk()).toBe(true);
    });

    test('allShipsSunk is false if no ships placed', () => {
        const board = Gameboard();
        expect(board.allShipsSunk()).toBe(false);
    });
});