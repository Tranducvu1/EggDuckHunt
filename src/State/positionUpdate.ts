import { Duck } from '../Types/Duck';

export function updateDuckPosition(duck: Duck, duckElement: HTMLImageElement): void {
    duckElement.style.left = `${duck.position.left}%`;
    duckElement.style.top = `${duck.position.top}%`;
}
