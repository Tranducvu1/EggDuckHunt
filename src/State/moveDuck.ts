import { normalDucks } from '../DuckManager/duckManager';
import { Duck } from '../Types/Duck';
import { applyBoundaryConstraints } from './boundary';
import { updateActualDirection } from './directionUpdate';

import { moveByType } from './movementTypes/moveByType';
import { handlePondDetection } from './pondHandler';
import { updateDuckPosition } from './positionUpdate';


export function moveDuck(duck: Duck): void {
    if (!duck.moving) return;

    const duckElement = document.getElementById(duck.id) as HTMLImageElement;
    if (!duckElement) return;

    if (!duck.startTime) {
        duck.startTime = Date.now();
        duck.restDuration = Math.random() * 2000 + 500;
    }

    const elapsedTime = (Date.now() - duck.startTime) / 1000;
    if (elapsedTime >= 20) {
        duck.moving = false;
        setTimeout(() => {
            duck.moving = true;
            duck.startTime = Date.now();
        }, duck.restDuration);
        return;
    }

    const prevPosition = { ...duck.position };
    moveByType(duck);
    applyBoundaryConstraints(duck);
    updateDuckPosition(duck, duckElement);
    updateActualDirection(duck, prevPosition);
    handlePondDetection(duck, duckElement);
}
const duckMovementIntervals: NodeJS.Timeout[] = [];

// Function to set up normal duck movement
export function setupNormalDuckMovement() {
    normalDucks.forEach(duck => {
        const interval = setInterval(() => moveDuck(duck), 150);
        duckMovementIntervals.push(interval);
    });
}