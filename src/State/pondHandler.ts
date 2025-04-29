// handlePondDetection.ts

import { Duck } from '../Types/Duck';
import { GAME_CONSTANTS } from '../Constant/constant';
import { updateDuckInPondSprite, updateDuckSprite } from './spriteUpdate';

/**
 * Checks whether the duck is within the defined pond area
 * and handles enter/exit behavior and sprite updates accordingly.
 *
 * @param duck - The duck to check.
 * @param duckElement - The corresponding HTML image element.
 */
export function handlePondDetection(duck: Duck, duckElement: HTMLImageElement): void {
    const { POND } = GAME_CONSTANTS;

    const isInPond = 
        duck.position.left >= POND.LEFT && 
        duck.position.left <= POND.RIGHT && 
        duck.position.top >= POND.TOP && 
        duck.position.top <= POND.BOTTOM;

    // Handle duck entering the pond
    if (isInPond && !duck.inPond) {
        enterPond(duck, duckElement);
    }
    // Handle duck exiting the pond
    else if (!isInPond && duck.inPond) {
        exitPond(duck);
    }

    // Update sprite based on pond status
    if (isInPond) {
        updateDuckInPondSprite(duck, duckElement);
    } else {
        updateDuckSprite(duck, duckElement);
    }
}

/**
 * Sets duck state to "in pond", and triggers relaxation timers.
 * Timers simulate relaxation animations/states.
 *
 * @param duck - The duck that enters the pond.
 * @param duckElement - The corresponding image element.
 */
export function enterPond(duck: Duck, duckElement: HTMLImageElement): void {
    duck.inPond = true;
    duck.relaxState = 0;

    // Clear any existing timers before setting new ones
    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);

    // Start first relaxation timer
    duck.relaxTimer1 = setTimeout(() => {
        if (duck.inPond) {
            duck.relaxState = 1;

            // Start second relaxation timer
            duck.relaxTimer2 = setTimeout(() => {
                if (duck.inPond) {
                    duck.relaxState = 2;
                }
            }, 5000);
        }
    }, 2000);
}

/**
 * Resets pond-related state and clears relaxation timers when duck exits the pond.
 *
 * @param duck - The duck that exits the pond.
 */
export function exitPond(duck: Duck): void {
    duck.inPond = false;
    duck.relaxState = undefined;

    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
}
