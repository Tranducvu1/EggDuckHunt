import { Duck } from '../Types/Duck';

export function updateActualDirection(duck: Duck, prevPosition: { left: number; top: number }): void {
    if (Math.abs(duck.position.left - prevPosition.left) > 0.01) {
        duck.direction.x = duck.position.left > prevPosition.left ? 1 : -1;
    }
    if (Math.abs(duck.position.top - prevPosition.top) > 0.01) {
        duck.direction.y = duck.position.top > prevPosition.top ? 1 : -1;
    }
}
