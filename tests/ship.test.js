import Ship from '../src/ship.js'

describe('Ship', () => {
    test('Ship has correct length', () => {
        const ship = Ship(4);
        expect(ship.length).toBe(4);
    });

    test('hit() increments hits', () => {
        const ship = Ship(3);
        ship.hit();
        expect(ship.getHits()).toBe(1);
        ship.hit();
        expect(ship.getHits()).toBe(2);
    });

    test ('isSunk() returns false if not enough hits', () => {
        const ship = Ship(2);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });
});