import { Duck } from '../Types/Duck';
import { redDucks, yellowDucks } from '../DuckManager/duckManager';

export function getDuckSpritePath(duck: Duck, type: string): string {
    let basePath = "../assets/duck";

    const isRedDuck = redDucks.some(rduck => rduck.id === duck.id);
    const isYellowDuck = yellowDucks.some(yduck => yduck.id === duck.id);

    if (isRedDuck) {
        basePath += type === "relax" ? "/relax-red" : "/right-left-red";
    } else if (isYellowDuck) {
        basePath += type === "relax" ? "/relax-yellow" : "/right-left-yellow";
    } else {
        basePath += type === "relax" ? "/relax" : "/right-left";
    }

    return basePath;
}
