import { DuckType } from '../Types/DuckType';
import { ducks } from '../Types/duckConfigs'; // hoặc wherever ducks is declared
import { Duck } from '../Types/Duck';

/**
 * Returns the sprite path for a duck based on its type (red, yellow, or normal) and action type (relax or move).
 */
export function getDuckSpritePath(duck: Duck, type: string): string {
    let basePath = "../assets/duck";

    const isRedDuck = ducks[DuckType.RED].some(rduck => rduck.id === duck.id);
    const isYellowDuck = ducks[DuckType.YELLOW].some(yduck => yduck.id === duck.id);
    const isWhiteDuck = ducks[DuckType.WHITE].some(wduck => wduck.id === duck.id);

    if (isRedDuck) {
        basePath += type === "relax" ? "/relax-red" : "/right-left-red";
    } else if (isYellowDuck) {
        basePath += type === "relax" ? "/relax-yellow" : "/right-left-yellow";
    } else if (isWhiteDuck) {
        basePath += type === "relax" ? "/relax" : "/right-left";
    }

    return basePath;
}
