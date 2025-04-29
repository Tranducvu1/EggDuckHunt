// getDuckSpritePath.ts

import { Duck } from '../Types/Duck';
import { redDucks, yellowDucks } from '../DuckManager/duckManager';

/**
 * Returns the sprite path for a duck based on its type (red, yellow, or normal) and action type (relax or move).
 * 
 * @param duck - The duck object to get the sprite path for.
 * @param type - The action type ('relax' or 'move' animation).
 * @returns The relative path to the duck's sprite asset.
 */
export function getDuckSpritePath(duck: Duck, type: string): string {
    let basePath = "../assets/duck";

    const isRedDuck = redDucks.some(rduck => rduck.id === duck.id);
    const isYellowDuck = yellowDucks.some(yduck => yduck.id === duck.id);

    // Determine the specific sprite path based on duck type and action type
    if (isRedDuck) {
        basePath += type === "relax" ? "/relax-red" : "/right-left-red";
    } else if (isYellowDuck) {
        basePath += type === "relax" ? "/relax-yellow" : "/right-left-yellow";
    } else {
        basePath += type === "relax" ? "/relax" : "/right-left";
    }

    return basePath;
}
