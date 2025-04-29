// applyBoundaryConstraints.ts

import { Duck } from '../Types/Duck';
import { GAME_CONSTANTS } from '../Constant/constant';

/**
 * Reverses the duck's direction and adjusts its position 
 * when it moves outside the defined game boundaries.
 * 
 * @param duck - The duck object to constrain.
 */
export function applyBoundaryConstraints(duck: Duck): void {
    const { DUCK } = GAME_CONSTANTS;

    // Check horizontal boundaries
    if (duck.position.left >= DUCK.MAX_LEFT) {
        duck.position.left = DUCK.MAX_LEFT - 0.1; // Slight offset to prevent sticking
        duck.direction.x *= -1; // Reverse horizontal direction
    }
    if (duck.position.left <= DUCK.MIN_LEFT) {
        duck.position.left = DUCK.MIN_LEFT + 0.1;
        duck.direction.x *= -1;
    }

    // Check vertical boundaries
    if (duck.position.top >= DUCK.MAX_TOP) {
        duck.position.top = DUCK.MAX_TOP - 0.1;
        duck.direction.y *= -1; // Reverse vertical direction
    }
    if (duck.position.top <= DUCK.MIN_TOP) {
        duck.position.top = DUCK.MIN_TOP + 0.1;
        duck.direction.y *= -1;
    }
}
