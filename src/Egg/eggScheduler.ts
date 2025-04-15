import { Duck } from '../Types/types';
import { moveDuckToBasket as moveNormalDuckToBasket } from './eggLaying';
import { moveDuckToBasket as moveYellowDuckToBasket } from './eggLayingYellow';
import { moveDuckToBasket as moveRedDuckToBasket } from './eggLayingRed';
import { GAME_CONSTANTS } from '../Constant/constant';
import { normalDucks} from '../DuckManager/duckManager';
import { redDucks} from '../DuckManager/duckRedManager';
import { yellowDucks } from '../DuckManager/duckYellowManager';

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
                moveNormalDuckToBasket(duck);
            } else if (redDucks.includes(duck)) {
                moveRedDuckToBasket(duck);
            } else if (yellowDucks.includes(duck)) {
                moveYellowDuckToBasket(duck);
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
