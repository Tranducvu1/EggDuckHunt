// Importing the `moveDuckToBasket` function from the eggLaying module
import { moveDuckToBasket } from './eggLaying'; 

// Importing constants and duck arrays for different duck types
import { GAME_CONSTANTS } from '../Constant/constant'; 
import { normalDucks, redDucks, yellowDucks } from '../DuckManager/duckManager'; 
import { Duck } from '../Types/Duck';

// Function to set up the random egg-laying schedule for all ducks
export function setupRandomEggLaying(): void {
    // Schedule egg laying for normal, red, and yellow ducks
    normalDucks.forEach(scheduleEggLayingForDuck);
    redDucks.forEach(scheduleEggLayingForDuck);
    yellowDucks.forEach(scheduleEggLayingForDuck);
}

// Function to schedule egg-laying for a specific duck
function scheduleEggLayingForDuck(duck: Duck): void {
    // Destructure the constants for minimum and maximum egg-laying time
    const { MIN_EGG_TIME, MAX_EGG_TIME } = GAME_CONSTANTS.MOVEMENT;

    // If the duck already has an interval set for auto-move, clear it
    if (duck.autoMoveInterval) {
        clearTimeout(duck.autoMoveInterval);
    }

    // Calculate the next egg-laying time by choosing a random value between MIN_EGG_TIME and MAX_EGG_TIME
    const nextEggTime = MIN_EGG_TIME + Math.random() * (MAX_EGG_TIME - MIN_EGG_TIME);

    // Set a timeout to trigger egg-laying after the calculated time
    duck.autoMoveInterval = setTimeout(() => {
        // Check if the duck is moving
        if (duck.moving) {
            // Depending on the duck type, move the duck to the basket
            if (normalDucks.includes(duck)) {
                moveDuckToBasket(duck);
            } else if (redDucks.includes(duck)) {
                moveDuckToBasket(duck);
            } else if (yellowDucks.includes(duck)) {
                moveDuckToBasket(duck);
            }

            // After laying the egg, schedule the next egg-laying for this duck in 25 seconds
            setTimeout(() => {
                scheduleEggLayingForDuck(duck);
            }, 25000); // 25000ms = 25s
        } else {
            // If the duck is not moving, try again in 5 seconds to schedule egg-laying
            setTimeout(() => {
                scheduleEggLayingForDuck(duck);
            }, 5000); // 5000ms = 5s
        }
    }, nextEggTime); // Delay before starting the egg-laying process
}
