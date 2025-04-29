// moveCircular.ts
import { Duck } from '../../Types/Duck';

/**
 * Calculates the new position for the duck moving in a circular path.
 * 
 * @param center - The center point of the circle.
 * @param radius - The radius of the circular path.
 * @param progress - The current progress along the path.
 * @returns The new (left, top) position.
 */
function calculateCircularPosition(center: { left: number; top: number }, radius: number, progress: number) {
    const left = center.left + Math.cos(progress) * radius;
    const top = center.top + Math.sin(progress) * radius;
    return { left, top };
}

/**
 * Moves the duck in a circular path.
 * 
 * @param duck - The duck object to move.
 */
export function moveCircular(duck: Duck): void {
    // Initialize properties if not already set
    if (!duck.centerPoint || !duck.radius || duck.pathProgress === undefined) {
        duck.centerPoint = { left: duck.position.left, top: duck.position.top };
        duck.radius = 15; // Default radius
        duck.pathProgress = 0;
    }

    // Increment path progress based on duck's speed
    duck.pathProgress += duck.speed * 0.05;

    // Calculate the new position
    const { left: newLeft, top: newTop } = calculateCircularPosition(
        duck.centerPoint,
        duck.radius,
        duck.pathProgress
    );

    // Update direction based on position change
    duck.direction.x = newLeft > duck.position.left ? 1 : -1;
    duck.direction.y = newTop > duck.position.top ? 1 : -1;

    // Update duck's position
    duck.position.left = newLeft;
    duck.position.top = newTop;
}
