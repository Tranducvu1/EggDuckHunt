import { Duck } from '../../Types/Duck';

export function moveLinear(duck: Duck): void {
    duck.position.left += duck.direction.x * duck.speed;
    duck.position.top += duck.direction.y * duck.speed;
}
