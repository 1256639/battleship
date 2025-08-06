import Gameboard from './gameboard.js';

export default function Player(type = 'human') {
    const gameboard = Gameboard();

    return { type, gameboard };
}