import Player from '../src/player.js';
import Gameboard from '../src/gameboard.js';

describe('Player', () => {
    test('creates a human player by default', () => {
        const player = Player();
        expect(player.type).toBe('human');
        expect(typeof player.gameboard).toBe('object');
    });

    test('can create a computer player', () => {
        const computer = Player('computer');
        expect(computer.type).toBe('computer');
        expect(typeof computer.gameboard).toBe('object');
    });

    test('each player gets their own gameboard', () => {
        const player1 = Player();
        const player2 = Player();
        expect(player1.gameboard).not.toBe(player2.gameboard);
    });
})