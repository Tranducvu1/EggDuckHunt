import { Duck } from '../../Types/Duck';
import { moveCircular } from './moveCircular';
import { moveLinear } from './moveLinear';
import { moveRandom } from './moveRandom';
import { moveZigzag } from './moveZigzag';


export function moveByType(duck: Duck): void {
    switch (duck.movementType) {
        case "linear":
            moveLinear(duck);
            break;
        case "circular":
            moveCircular(duck);
            break;
        case "zigzag":
            moveZigzag(duck);
            break;
        case "random":
            moveRandom(duck);
            break;
    }
}
