import { getRandomMovementType, getRandomDirection, getRandomPosition } from '../Ultils/Ultils';
import { GAME_CONSTANTS } from '../Constant/constant';
import { DuckType } from '../Types/DuckType';
import { DUCK_CONFIGS, ducks } from '../Types/duckConfigs';
import { Duck } from '../Types/Duck';

/**
 * Cập nhật số lượng vịt dựa trên giá trị trong localStorage
 * @param duckType Loại vịt cần cập nhật
 */
export function updateDucksBasedOnCount(duckType: DuckType): void {
    const config = DUCK_CONFIGS[duckType];
    const duckCount = parseInt(localStorage.getItem(config.storageKey) || GAME_CONSTANTS.DUCK.DEFAULT_COUNT.toString());
    const currentDuckCount = ducks[duckType].length;
    
    // Thêm vịt nếu cần
    if (duckCount > currentDuckCount) {
        for (let i = currentDuckCount; i < duckCount; i++) {
            createNewDuck(duckType, i + 1);
        }
    }
    // Xóa vịt nếu có quá nhiều
    else if (duckCount < currentDuckCount && duckCount >= GAME_CONSTANTS.DUCK.DEFAULT_COUNT) {
        removeExcessDucks(duckType, currentDuckCount - duckCount);
    }
}

/**
 * Tạo một con vịt mới với loại và chỉ số xác định
 * @param duckType Loại vịt cần tạo
 * @param index Chỉ số của vịt
 */
function createNewDuck(duckType: DuckType, index: number): void {
    const config = DUCK_CONFIGS[duckType];
    const position = getRandomPosition();
    const movementType = getRandomMovementType();
    
    // Tạo vịt mới với các thuộc tính ngẫu nhiên
    const newDuck: Duck = {
        id: `${config.idPrefix}${index}`,
        type: duckType,
        size: 100,
        position: position,
        direction: getRandomDirection(),
        speed: 0.2 + Math.random() * 0.2,
        frame: 1,
        moving: true,
        inPond: false,
        movementType: movementType,
        autoMoveInterval: undefined,
        selectedBasket: null
    };
    
    // Thêm các thuộc tính chuyển động cụ thể
    initializeMovementProperties(newDuck);
    
    // Thêm vào mảng vịt
    ducks[duckType].push(newDuck);
    
    // Tạo phần tử DOM
    createDuckElement(duckType, newDuck);
}

/**
 * Khởi tạo thuộc tính chuyển động cho vịt
 * @param duck Đối tượng vịt cần khởi tạo
 */
function initializeMovementProperties(duck: Duck): void {
    if (duck.movementType === "circular") {
        duck.centerPoint = { left: duck.position.left, top: duck.position.top };
        duck.radius = 10 + Math.random() * 10;
        duck.pathProgress = Math.random() * Math.PI * 2;
    } else if (duck.movementType === "zigzag") {
        duck.zigzagAmplitude = 3 + Math.random() * 5;
    }
}

/**
 * Tạo phần tử DOM cho vịt
 * @param duckType Loại vịt
 * @param duck Đối tượng vịt
 */
function createDuckElement(duckType: DuckType, duck: Duck): void {
    const config = DUCK_CONFIGS[duckType];
    const duckElement = document.createElement('img');
    duckElement.id = duck.id;
    duckElement.classList.add(config.className);
    duckElement.src = `${config.imagePath}${duck.direction.x > 0 ? 1 : 3}.png`;
    duckElement.style.position = 'absolute';
    duckElement.style.width = '100px';
    duckElement.style.zIndex = '10';
    duckElement.style.left = `${duck.position.left}%`;
    duckElement.style.top = `${duck.position.top}%`;
    duckElement.style.cursor = 'pointer';
    
    // Thêm vào DOM
    document.body.appendChild(duckElement);
}

/**
 * Xóa số lượng vịt thừa
 * @param duckType Loại vịt
 * @param count Số lượng vịt cần xóa
 */
function removeExcessDucks(duckType: DuckType, count: number): void {
    const duckArray = ducks[duckType];
    for (let i = 0; i < count; i++) {
        const duckToRemove = duckArray.pop();
        if (duckToRemove) {
            const element = document.getElementById(duckToRemove.id);
            if (element) element.remove();
            
            // Xóa bất kỳ bộ hẹn giờ nào cho vịt bị xóa
            clearDuckTimers(duckToRemove);
        }
    }
}

/**
 * Xóa bộ hẹn giờ cho vịt
 * @param duck Đối tượng vịt
 */
function clearDuckTimers(duck: Duck): void {
    if (duck.autoMoveInterval) clearTimeout(duck.autoMoveInterval);
    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
}

/**
 * Thay đổi kiểu chuyển động của vịt
 * @param duckType Loại vịt
 * @param duckId ID của vịt
 * @param newMovementType Kiểu chuyển động mới
 */
export function changeDuckMovementType(duckType: DuckType, duckId: string, newMovementType: Duck["movementType"]): void {
    const duck = ducks[duckType].find(d => d.id === duckId);
    if (!duck) return;
    
    duck.movementType = newMovementType;
    
    // Đặt lại các thuộc tính chuyển động cụ thể
    if (newMovementType === "circular") {
        duck.centerPoint = { 
            left: duck.position.left, 
            top: duck.position.top 
        };
        duck.radius = 15;
        duck.pathProgress = 0;
    }
}

/**
 * Hàm tiện ích để cập nhật tất cả các loại vịt
 */
export function updateAllDuckTypes(): void {
    updateDucksBasedOnCount(DuckType.NORMAL); 
    updateDucksBasedOnCount(DuckType.RED);
updateDucksBasedOnCount(DuckType.YELLOW);

    updateDucksBasedOnCount(DuckType.NORMAL); 
    updateDucksBasedOnCount(DuckType.RED);
    updateDucksBasedOnCount(DuckType.YELLOW);
}

// Các hàm tiện ích bổ sung để tương thích ngược với mã hiện có

// Xuất các mảng vịt riêng lẻ để tương thích với mã hiện có
export const normalDucks = ducks.normal;
export const redDucks = ducks.red;
export const yellowDucks = ducks.yellow;
export function updateNormalDucksBasedOnCount(): void {
    updateDucksBasedOnCount(DuckType.NORMAL);
}

export function updateRedDucksBasedOnCount(): void {
    updateDucksBasedOnCount(DuckType.RED);
}

export function updateYellowDucksBasedOnCount(): void {
    updateDucksBasedOnCount(DuckType.YELLOW);
}

// Các hàm thay đổi kiểu chuyển động cụ thể cho mỗi loại vịt
export function changeNormalDuckMovementType(duckId: string, newMovementType: Duck["movementType"]): void {
    changeDuckMovementType(DuckType.NORMAL, duckId, newMovementType);
}

export function changeRedDuckMovementType(duckId: string, newMovementType: Duck["movementType"]): void {
    changeDuckMovementType(DuckType.RED, duckId, newMovementType);
}

export function changeYellowDuckMovementType(duckId: string, newMovementType: Duck["movementType"]): void {
    changeDuckMovementType(DuckType.YELLOW, duckId, newMovementType);
}