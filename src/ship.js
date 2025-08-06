export default function Ship(length) {
    let hits = 0;

    function hit() {
        if (hits < length) {
            hits += 1;
        }
    }

    function isSunk() {
        return hits >= length;
    }

    function getHits() {
        return hits;
    }

    return {
        length, hit, isSunk, getHits
    };
}