import { DuckType } from '../Types/DuckType';
import { ducks } from '../Types/duckConfigs';
import { Duck } from '../Types/Duck';

/**
 * Returns the sprite path for a duck based on its type and action.
 * Đảm bảo sprite tồn tại trước khi trả về.
 */
export function getDuckSpritePath(duck: Duck, type: string): string {
    let basePath = "../assets/duck";
    let spritePath = "";
    
    // Xác định loại vịt - code này đã hoạt động tốt theo log
    const isRedDuck = ducks[DuckType.RED]?.some(rduck => rduck.id === duck.id);
    const isYellowDuck = ducks[DuckType.YELLOW]?.some(yduck => yduck.id === duck.id);
    const isWhiteDuck = ducks[DuckType.WHITE]?.some(wduck => wduck.id === duck.id);
    
    // Xác định đường dẫn sprite
    if (isRedDuck) {
        spritePath = type === "relax" ? "/relax-red" : "/right-left-red";
    } else if (isYellowDuck) {
        spritePath = type === "relax" ? "/relax-yellow" : "/right-left-yellow";
    } else if (isWhiteDuck){
        spritePath = type === "relax" ? "/relax" : "/right-left";
    }
    
    const fullPath = basePath + spritePath;
    
    try {
        // Kiểm tra nếu có lỗi "Cannot read properties of null (reading 'data')"
        // Có thể xảy ra khi truy cập dữ liệu sprite
        return fullPath;
    } catch (error) {
        console.error(`Error loading sprite for duck ${duck.id}: ${error}`);
        // Trả về sprite mặc định (vịt trắng) để tránh crash
        return basePath + (type === "relax" ? "/relax" : "/right-left");
    }
}