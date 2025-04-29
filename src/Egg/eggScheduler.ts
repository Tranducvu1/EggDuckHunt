import { moveDuckToBasket  } from './eggLaying';


import { GAME_CONSTANTS } from '../Constant/constant';
import { normalDucks, redDucks, yellowDucks } from '../DuckManager/duckManager';
import { Duck } from '../Types/Duck';

export function setupRandomEggLaying(): void {
    normalDucks.forEach(scheduleEggLayingForDuck);
    redDucks.forEach(scheduleEggLayingForDuck);
    yellowDucks.forEach(scheduleEggLayingForDuck);
}

function scheduleEggLayingForDuck(duck: Duck): void {
    const { MIN_EGG_TIME, MAX_EGG_TIME } = GAME_CONSTANTS.MOVEMENT;

    if (duck.autoMoveInterval) {
        clearTimeout(duck.autoMoveInterval);
    }

    const nextEggTime = MIN_EGG_TIME + Math.random() * (MAX_EGG_TIME - MIN_EGG_TIME);

    duck.autoMoveInterval = setTimeout(() => {
        if (duck.moving) {
            if (normalDucks.includes(duck)) {
                moveDuckToBasket(duck);
            } else if (redDucks.includes(duck)) {
                moveDuckToBasket(duck);
            } else if (yellowDucks.includes(duck)) {
                moveDuckToBasket(duck);
            }

            setTimeout(() => {
                scheduleEggLayingForDuck(duck);
            }, 25000);
        } else {
            setTimeout(() => {
                scheduleEggLayingForDuck(duck);
            }, 5000);
        }
    }, nextEggTime);
}
