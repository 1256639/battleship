import Ship from '../src/ship.js'

describe('Ship', () => {
    test('Ship has correct length', () => {
        const ship = Ship(4);
        expect(ship.length).toBe(4);
    });
});