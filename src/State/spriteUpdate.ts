import { Duck } from '../Types/Duck';
import { getDuckSpritePath } from './getDuckSpritePath';


export function updateDuckInPondSprite(duck: Duck, duckElement: HTMLImageElement): void {
    const facingRight = duck.direction.x >= 0;
    const spritePath = getDuckSpritePath(duck, "relax");

    if (!duck.relaxState || duck.relaxState === 0) {
        duckElement.src = facingRight ? `${spritePath}/a3.png` : `${spritePath}/a1.png`;
    } else if (duck.relaxState === 1) {
        duckElement.src = facingRight ? `${spritePath}/a5.png` : `${spritePath}/a7.png`;
    } else if (duck.relaxState === 2) {
        duckElement.src = facingRight ? `${spritePath}/a6.png` : `${spritePath}/a8.png`;
    }
}

export function updateDuckSprite(duck: Duck, duckElement: HTMLImageElement): void {
    if (Math.random() < 0.1) {
        const spritePath = getDuckSpritePath(duck, "movement");
        duckElement.src = `${spritePath}/a${duck.frame + (duck.direction.x < 0 ? 2 : 0)}.png`;
        duck.frame = duck.frame === 1 ? 2 : 1;
    }
}
