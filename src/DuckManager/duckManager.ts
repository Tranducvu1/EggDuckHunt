// Import utility functions for random movement, direction, and position
import { getRandomMovementType, getRandomDirection, getRandomPosition } from '../Ultils/Ultils';
// Import game constants and duck configurations
import { GAME_CONSTANTS } from '../Constant/constant';
import { DuckType } from '../Types/DuckType';
import { DUCK_CONFIGS, ducks } from '../Types/duckConfigs';
import { Duck } from '../Types/Duck';
//@ts-ignore
import { state } from '../components/ContractActions.js';


// update duck base on count yellow, red , white, in contract
export async function updateDucksBasedOnCount(duckType: DuckType): Promise<void> {
   
    const { yellow = 0, red = 0, white = 0 } = state.duckCount || {};

    console.log("so vit la " + white + red + yellow);

    // const config = DUCK_CONFIGS[duckType];
    const currentDuckCount = ducks[duckType].length;

    // Lấy số lượng cần từ contract theo loại vịt
    let targetCount = 0;
    if (duckType === DuckType.WHITE) targetCount = white;
    if (duckType === DuckType.YELLOW) targetCount = yellow;
    if (duckType === DuckType.RED) targetCount = red;

    // Nếu thiếu vịt, thêm mới
    if (targetCount > currentDuckCount) {
        for (let i = currentDuckCount; i < targetCount; i++) {
            createNewDuck(duckType, i + 1);
        }
    }
    
    console.log(`Updating ducks of type ${duckType}, current=${currentDuckCount}, target=${targetCount}`);


}

/**
 * Create a new duck with a specified type and index.
 * @param duckType The type of duck to create.
 * @param index The index for the new duck.
 */
function createNewDuck(duckType: DuckType, index: number): void {
    const config = DUCK_CONFIGS[duckType]; // Retrieve configuration for duck type
    const position = getRandomPosition(); // Get a random position for the duck
    const movementType = getRandomMovementType(); // Get a random movement type for the duck

    // Create a new duck object with random properties
    const newDuck: Duck = {
        id: `${config.idPrefix}${index}`,
        type: duckType,
        level: 1,
        size: 100,
        position: position,
        direction: getRandomDirection(), // Get a random direction for the duck
        speed: 0.2 + Math.random() * 0.2, // Random speed between 0.2 and 0.4
        frame: 1,
        moving: true,
        inPond: false,
        movementType: movementType, // Set the movement type
        autoMoveInterval: undefined,
        selectedBasket: null
    };

    // Initialize specific movement properties
    initializeMovementProperties(newDuck);

    // Add the new duck to the ducks array
    ducks[duckType].push(newDuck);

    // Create a DOM element for the new duck
    createDuckElement(duckType, newDuck);
}

/**
 * Initialize movement properties for a duck based on its movement type.
 * @param duck The duck object to initialize.
 */
function initializeMovementProperties(duck: Duck): void {
    if (duck.movementType === "circular") {
        // Circular movement: Set center, radius, and path progress
        duck.centerPoint = { left: duck.position.left, top: duck.position.top };
        duck.radius = 10 + Math.random() * 10; // Random radius between 10 and 20
        duck.pathProgress = Math.random() * Math.PI * 2; // Random path progress
    } else if (duck.movementType === "zigzag") {
        // Zigzag movement: Set amplitude
        duck.zigzagAmplitude = 3 + Math.random() * 5; // Random amplitude between 3 and 8
    }
}

/**
 * Create the DOM element for a duck and place it on the screen.
 * @param duckType The type of duck.
 * @param duck The duck object.
 */
function createDuckElement(duckType: DuckType, duck: Duck): void {
    const config = DUCK_CONFIGS[duckType]; // Retrieve the duck configuration
    const duckElement = document.createElement('img'); // Create an image element for the duck
    duckElement.id = duck.id;
    duckElement.classList.add(config.className); // Add the appropriate CSS class
    duckElement.src = `${config.imagePath}${duck.direction.x > 0 ? 1 : 3}.png`; // Set the image based on the direction
    duckElement.style.position = 'absolute'; // Position the duck on the screen
    duckElement.style.width = '100px';
    duckElement.style.zIndex = '10'; // Set the z-index for layering
    duckElement.style.left = `${duck.position.left}%`; // Set the left position
    duckElement.style.top = `${duck.position.top}%`; // Set the top position
    duckElement.style.cursor = 'pointer'; // Make the duck clickable
    duckElement.addEventListener('click', () => {
        showUpgradeButton(duckType, duck);
    });
    // Append the duck element to the DOM
    document.body.appendChild(duckElement);
}

/**
 * Remove excess ducks from the pond based on the specified count.
 * @param duckType The type of duck.
 * @param count The number of ducks to remove.
 */
function removeExcessDucks(duckType: DuckType, count: number): void {
    const duckArray = ducks[duckType]; // Get the array of ducks of the specified type
    for (let i = 0; i < count; i++) {
        const duckToRemove = duckArray.pop(); // Remove the last duck in the array
        if (duckToRemove) {
            const element = document.getElementById(duckToRemove.id); // Find the corresponding DOM element
            if (element) element.remove(); // Remove the element from the DOM

            // Clear any timers associated with the duck
            clearDuckTimers(duckToRemove);
        }
    }
}

/**
 * Clear all timers associated with a duck.
 * @param duck The duck object whose timers need to be cleared.
 */
function clearDuckTimers(duck: Duck): void {
    if (duck.autoMoveInterval) clearTimeout(duck.autoMoveInterval);
    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
}

function showUpgradeButton(duckType: DuckType, duck: Duck): void {
    const existingButton = document.getElementById(`upgrade-${duck.id}`);
    if (existingButton) return; // tránh tạo lại

    const upgradeBtn = document.createElement('button');
    upgradeBtn.id = `upgrade-${duck.id}`;
    upgradeBtn.textContent = '⬆️ Nâng cấp';
    upgradeBtn.style.position = 'absolute';
    upgradeBtn.style.left = `${duck.position.left}%`;
    upgradeBtn.style.top = `${duck.position.top - 1}%`; // phía trên vịt
    upgradeBtn.style.zIndex = '20';
    upgradeBtn.style.backgroundColor = 'gold';
    upgradeBtn.style.border = 'none';
    upgradeBtn.style.padding = '4px';
    upgradeBtn.style.cursor = 'pointer';

    upgradeBtn.onclick = () => {
        duck.level += 1;

        // Hiển thị dòng chữ màu xanh
        const upgradeText = document.createElement('div');
        upgradeText.textContent = `Level ${duck.level} đã được mở khóa!`;
        upgradeText.style.position = 'absolute';
        upgradeText.style.left = `${duck.position.left}%`;
        upgradeText.style.top = `${duck.position.top - 5}%`; // Thêm khoảng cách phía trên vịt
        upgradeText.style.color = 'green';
        upgradeText.style.fontSize = '16px';
        upgradeText.style.fontWeight = 'bold';
        upgradeText.style.zIndex = '30';
        upgradeText.style.transition = 'opacity 1s ease-out';

        // Thêm hiệu ứng mờ dần (fade out) và loại bỏ sau 2 giây
        document.body.appendChild(upgradeText);
        setTimeout(() => {
            upgradeText.style.opacity = '0';
        }, 1000); // Sau 1 giây bắt đầu fade out

        setTimeout(() => {
            upgradeText.remove();
        }, 2000); // Sau 2 giây, loại bỏ hoàn toàn
        

        upgradeBtn.remove();
    };

    document.body.appendChild(upgradeBtn);

    // Tự động ẩn sau 5 giây
    setTimeout(() => upgradeBtn.remove(), 5000);
}


/**
 * Change the movement type of a duck.
 * @param duckType The type of duck.
 * @param duckId The ID of the duck to change.
 * @param newMovementType The new movement type to set.
 */
export function changeDuckMovementType(duckType: DuckType, duckId: string, newMovementType: Duck["movementType"]): void {
    const duck = ducks[duckType].find(d => d.id === duckId); // Find the duck by ID
    if (!duck) return; // If no duck is found, do nothing
    
    duck.movementType = newMovementType; // Set the new movement type
    
    // Initialize movement properties based on the new movement type
    if (newMovementType === "circular") {
        duck.centerPoint = { 
            left: duck.position.left, 
            top: duck.position.top 
        };
        duck.radius = 15; // Set the radius for circular movement
        duck.pathProgress = 0; // Reset the path progress
    }
}

/**
 * Utility function to update all duck types based on their counts.
 */
export function updateAllDuckTypes(): void {
    // Update each type of duck
    updateDucksBasedOnCount(DuckType.WHITE);
    updateDucksBasedOnCount(DuckType.RED);
    updateDucksBasedOnCount(DuckType.YELLOW);

}

// Additional utility functions for updating ducks based on type
export const normalDucks = ducks.white;
export const redDucks = ducks.red;
export const yellowDucks = ducks.yellow;

// Functions for updating specific duck types
export function updateNormalDucksBasedOnCount(): void {
    updateDucksBasedOnCount(DuckType.WHITE);
}

export function updateRedDucksBasedOnCount(): void {
    updateDucksBasedOnCount(DuckType.RED);
}

export function updateYellowDucksBasedOnCount(): void {
    updateDucksBasedOnCount(DuckType.YELLOW);
}

// Functions for changing the movement type of specific duck types
export function changeNormalDuckMovementType(duckId: string, newMovementType: Duck["movementType"]): void {
    changeDuckMovementType(DuckType.WHITE, duckId, newMovementType);
}

export function changeRedDuckMovementType(duckId: string, newMovementType: Duck["movementType"]): void {
    changeDuckMovementType(DuckType.RED, duckId, newMovementType);
}

export function changeYellowDuckMovementType(duckId: string, newMovementType: Duck["movementType"]): void {
    changeDuckMovementType(DuckType.YELLOW, duckId, newMovementType);
}
