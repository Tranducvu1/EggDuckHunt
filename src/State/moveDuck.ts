// moveDuck.ts

import { normalDucks, redDucks, yellowDucks } from '../DuckManager/duckManager';
import { Duck } from '../Types/Duck';
import { DuckType } from '../Types/DuckType';
import { applyBoundaryConstraints } from './boundary';
import { updateActualDirection } from './directionUpdate';
import { moveByType } from './movementTypes/moveByType';
import { handlePondDetection } from './pondHandler';
import { updateDuckPosition } from './positionUpdate';

const duckMovementIntervals: NodeJS.Timeout[] = [];

/**
 * Moves a single duck based on its current state and movement type.
 * Handles resting logic, boundary constraints, direction update, and pond detection.
 *
 * @param duck - The duck to be moved.
 */
export function moveDuck(duck: Duck): void {
    if (!duck.moving) return;

    const duckElement = document.getElementById(duck.id) as HTMLImageElement;
    if (!duckElement) return;

    // Initialize start time and rest duration if not already set
    if (!duck.startTime) {
        duck.startTime = Date.now();
        duck.restDuration = Math.random() * 2000 + 500; // Random rest time between 0.5s to 2.5s
    }

    const elapsedTime = (Date.now() - duck.startTime) / 1000;
    
    // If duck has been moving for 20 seconds, pause it for a rest duration
    if (elapsedTime >= 20) {
        duck.moving = false;
        setTimeout(() => {
            duck.moving = true;
            duck.startTime = Date.now();
        }, duck.restDuration);
        return;
    }

    // Save previous position for direction calculation
    const prevPosition = { ...duck.position };

    // Handle movement logic
    moveByType(duck);
    applyBoundaryConstraints(duck);
    updateDuckPosition(duck, duckElement);
    updateActualDirection(duck, prevPosition);
    handlePondDetection(duck, duckElement);
}

/**
 * Sets up movement intervals for all normal ducks.
 * Ducks move every 150 milliseconds.
 */
export function setupNormalDuckMovement(): void {
    normalDucks.forEach(duck => {
        const interval = setInterval(() => moveDuck(duck), 150);
        duckMovementIntervals.push(interval);
    });
}

export function setupYellowDuckMovement(): void {
    yellowDucks.forEach(duck => {
        const interval = setInterval(() => moveDuck(duck), 150);
        duckMovementIntervals.push(interval);
    });
}


export function setupRedDuckMovement(): void {
    redDucks.forEach(duck => {
        const interval = setInterval(() => moveDuck(duck), 150);
        duckMovementIntervals.push(interval);
    });
}

