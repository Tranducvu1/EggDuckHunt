// moveZigzag.ts

import { Duck } from "../../Types/Duck";


export function moveZigzag(duck: Duck): void {
    // Khởi tạo biên độ zigzag nếu chưa có
    if (duck.zigzagAmplitude === undefined) {
        duck.zigzagAmplitude = 5;
    }

    // Di chuyển ngang
    duck.position.left += duck.direction.x * duck.speed;

    // Zigzag theo hình sin mượt mà
    duck.position.top = duck.position.top + Math.sin(duck.position.left * 0.1) * duck.speed * 0.5;
}
