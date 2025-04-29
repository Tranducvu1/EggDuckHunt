// moveCircular.ts
import { Duck } from '../../Types/Duck';

export function moveCircular(duck: Duck): void {
    // Khởi tạo giá trị nếu chưa có
    if (!duck.centerPoint || !duck.radius || duck.pathProgress === undefined) {
        duck.centerPoint = { left: duck.position.left, top: duck.position.top };
        duck.radius = 15; // Bán kính mặc định
        duck.pathProgress = 0;
    }

    // Tiến độ đi vòng tròn tăng dần theo tốc độ
    duck.pathProgress += duck.speed * 0.05;

    // Tính toán vị trí mới
    const newLeft = duck.centerPoint.left + Math.cos(duck.pathProgress) * duck.radius;
    const newTop = duck.centerPoint.top + Math.sin(duck.pathProgress) * duck.radius;

    // Cập nhật hướng dựa trên thay đổi vị trí
    duck.direction.x = newLeft > duck.position.left ? 1 : -1;
    duck.direction.y = newTop > duck.position.top ? 1 : -1;

    // Gán vị trí mới
    duck.position.left = newLeft;
    duck.position.top = newTop;
}
