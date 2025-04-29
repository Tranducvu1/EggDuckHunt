import { GAME_CONSTANTS, MOVEMENT_TYPES } from "../Constant/constant"; // Import constants related to game settings and movement types
import { Duck } from "../Types/Duck"; // Import Duck type definition
import { Position } from "../Types/Position"; // Import Position type definition

// Function to get a random movement type for the duck
export function getRandomMovementType(): Duck["movementType"] {
    // Returns a random movement type from the predefined list of movement types
    return MOVEMENT_TYPES[Math.floor(Math.random() * MOVEMENT_TYPES.length)];
}

// Function to get a random direction for the duck's movement (x and y coordinates)
export function getRandomDirection(): { x: number, y: number } {
    return {
        // Randomly returns either 1 or -1 for x direction, and 0.5 or -0.5 for y direction
        x: Math.random() > 0.5 ? 1 : -1,
        y: Math.random() > 0.5 ? 0.5 : -0.5
    };
}

// Function to get a random position for the duck within the defined game area
export function getRandomPosition(): Position {
    const { DUCK } = GAME_CONSTANTS; // Extract game constants for duck's position range
    return {
        // Generates a random 'left' and 'top' position within the allowed boundaries
        left: DUCK.MIN_LEFT + Math.random() * (DUCK.MAX_LEFT - DUCK.MIN_LEFT),
        top: DUCK.MIN_TOP + Math.random() * (DUCK.MAX_TOP - DUCK.MIN_TOP)
    };
}
