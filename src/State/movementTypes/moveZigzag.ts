import { Duck } from "../../Types/Duck";


/**
 * 
 * @param left - The left position of the duck
 * @param speed - The speed of the duck
 * @returns - The calculated zigzag offset
 */

function calculateZigzagoffset(left:number ,speed:number):number {
    // calculate the zigzag offset based on the left position and speed
    const offset = Math.sin(left / 20) * speed;
    return offset;

}

export function moveZigzag(duck: Duck): void {
    if(duck.zigzagAmplitude === undefined) {
        duck.zigzagAmplitude = 5; 
    }

    duck.position.left += duck.direction.x * duck.speed;
    duck.position.top += duck.position.top + calculateZigzagoffset(duck.position.left, duck.zigzagAmplitude) * duck.speed;
}