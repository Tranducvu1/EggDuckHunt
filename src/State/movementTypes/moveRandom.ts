import { Duck } from "../../Types/Duck";


export function moveRandom(duck: Duck): void {
    // Giảm tần suất thay đổi hướng cho mượt
    if (Math.random() < 0.01) { // 1% mỗi frame
        // Chỉnh hướng ngẫu nhiên nhưng mượt, không đổi đột ngột
        duck.direction.x = duck.direction.x * 0.7 + (Math.random() > 0.5 ? 0.3 : -0.3);
        duck.direction.y = duck.direction.y * 0.7 + (Math.random() > 0.5 ? 0.15 : -0.15);

        // Chuẩn hóa để giữ tốc độ đồng đều
        const magnitude = Math.sqrt(duck.direction.x * duck.direction.x + duck.direction.y * duck.direction.y);
        if (magnitude > 0) {
            duck.direction.x /= magnitude;
            duck.direction.y /= magnitude;
        }
    }

    // Di chuyển dựa theo hướng hiện tại
    duck.position.left += duck.direction.x * duck.speed;
    duck.position.top += duck.direction.y * duck.speed;
}
