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
})