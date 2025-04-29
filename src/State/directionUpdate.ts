// updateActualDirection.ts

import { Duck } from '../Types/Duck';

/**
 * Updates the duck's actual movement direction based on its change in position.
 * 
 * @param duck - The duck object whose direction needs to be updated.
 * @param prevPosition - The previous position of the duck.
 */
export function updateActualDirection(
    duck: Duck, 
    prevPosition: { left: number; top: number }
): void {
    // Update horizontal direction if there is significant movement
    if (Math.abs(duck.position.left - prevPosition.left) > 0.01) {
        duck.direction.x = duck.position.left > prevPosition.left ? 1 : -1;
    }

    // Update vertical direction if there is significant movement
    if (Math.abs(duck.position.top - prevPosition.top) > 0.01) {
        duck.direction.y = duck.position.top > prevPosition.top ? 1 : -1;
    }
}
