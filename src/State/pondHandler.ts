import { Duck } from '../Types/Duck';
import { GAME_CONSTANTS } from '../Constant/constant';
import { updateDuckInPondSprite, updateDuckSprite } from './spriteUpdate';


export function handlePondDetection(duck: Duck, duckElement: HTMLImageElement): void {
    const { POND } = GAME_CONSTANTS;
    const isInPond = 
        duck.position.left >= POND.LEFT && 
        duck.position.left <= POND.RIGHT && 
        duck.position.top >= POND.TOP && 
        duck.position.top <= POND.BOTTOM;

    if (isInPond && !duck.inPond) {
        enterPond(duck, duckElement);
    } else if (!isInPond && duck.inPond) {
        exitPond(duck);
    }

    if (isInPond) {
        updateDuckInPondSprite(duck, duckElement);
    } else {
        updateDuckSprite(duck, duckElement);
    }
}

export function enterPond(duck: Duck, duckElement: HTMLImageElement): void {
    duck.inPond = true;
    duck.relaxState = 0;
    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
    
    duck.relaxTimer1 = setTimeout(() => {
        if (duck.inPond) {
            duck.relaxState = 1;
            duck.relaxTimer2 = setTimeout(() => {
                if (duck.inPond) {
                    duck.relaxState = 2;
                }
            }, 5000);
        }
    }, 2000);
}

export function exitPond(duck: Duck): void {
    duck.inPond = false;
    duck.relaxState = undefined;
    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
}
