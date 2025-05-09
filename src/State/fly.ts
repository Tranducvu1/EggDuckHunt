import { GAME_CONSTANTS } from "../Constant/constant";
import { redDucks, yellowDucks } from "../DuckManager/duckManager";
import { Duck } from "../Types/Duck";
import { ducks } from "../Types/duckConfigs";
import { DuckType } from "../Types/DuckType";

function updateDuckSprite(duck: Duck, duckElement: HTMLImageElement): void {
    let basePath = "../assets/duck";

   
    const isRedDuck = ducks[DuckType.RED]?.some(rduck => rduck.id === duck.id);
    const isYellowDuck = ducks[DuckType.YELLOW]?.some(yduck => yduck.id === duck.id);
    const isWhiteDuck = ducks[DuckType.WHITE]?.some(wduck => wduck.id === duck.id);
    if (isRedDuck) {
        basePath += "/fly-red";
    } else if (isYellowDuck) {
        basePath += "/fly-yellow";
    } else if(isWhiteDuck) {
        basePath += "/fly"; // trắng mặc định
    }

    const frame = duck.direction.x === -1 ? duck.frame + 2 : duck.frame; // a1, a2, a3, a4
    duckElement.src = `${basePath}/a${frame}.png`;

    // Toggle frame to animate wings
    duck.frame = duck.frame === 1 ? 2 : 1;
}

export function moveFly(duck: Duck): void {
    const { DUCK } = GAME_CONSTANTS;

    // Di chuyển theo hướng x như linear
    duck.position.left += duck.direction.x * duck.speed;

    // Bay nhẹ lên/xuống
    duck.position.top += Math.sin(Date.now() * 0.005) * 0.5;

    // Giới hạn ranh giới
    if (duck.position.left >= DUCK.MAX_LEFT || duck.position.left <= DUCK.MIN_LEFT) {
        duck.direction.x *= -1;
    }
    if (duck.position.top >= DUCK.MAX_TOP || duck.position.top <= DUCK.MIN_TOP) {
        duck.direction.y *= -1;
    }

    // Cập nhật sprite bay
    const duckElement = document.getElementById(duck.id) as HTMLImageElement;
    if (duckElement) updateDuckSprite(duck, duckElement);
}
