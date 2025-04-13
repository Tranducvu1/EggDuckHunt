// duckMovement.ts - Duck movement logic
import { Duck } from '../Types/types';
import { GAME_CONSTANTS } from '../Constant/constant';
import { ducks } from '../DuckManager/duckManager';

export function moveDuck(duck: Duck): void {
    if (!duck.moving) return;
    
    const duckElement = document.getElementById(duck.id) as HTMLImageElement;
    if (!duckElement) return;

// ⏳ Nếu chưa có thời gian bắt đầu, gán giá trị khởi tạo với thời gian nghỉ ngẫu nhiên
if (!duck.startTime) {
    duck.startTime = Date.now();
    duck.restDuration = Math.random() * 2000 + 500; // Nghỉ từ 0.5s đến 2s
}

// ⏳ Kiểm tra nếu đã di chuyển 20 giây
const elapsedTime = (Date.now() - duck.startTime) / 1000; // Chuyển sang giây
if (elapsedTime >= 20) {
    duck.moving = false; // Tạm dừng vịt
    setTimeout(() => {
        duck.moving = true;  
        duck.startTime = Date.now(); // Reset lại thời gian bắt đầu di chuyển
    }, duck.restDuration); // 🛠 Mỗi con vịt có thời gian nghỉ khác nhau
    return; 
}

    // Save previous position to calculate actual movement direction
    const prevPosition = { ...duck.position };

    // Calculate new position based on movement type
    moveByType(duck);

    // Apply boundary constraints with smoother behavior
    applyBoundaryConstraints(duck);

    // Update duck position on screen
    updateDuckPosition(duck, duckElement);
    
    // Calculate actual movement direction based on position change
    updateActualDirection(duck, prevPosition);
    
    // Check if duck is in pond
    handlePondDetection(duck, duckElement);
}

function moveByType(duck: Duck): void {
    switch (duck.movementType) {
        case "linear":
            moveLinear(duck);
            break;   
        case "circular":
            moveCircular(duck);
            break;
        case "zigzag":
            moveZigzag(duck);
            break;
        case "random":
            moveRandom(duck);
            break;
    }
}

function applyBoundaryConstraints(duck: Duck): void {
    const { DUCK } = GAME_CONSTANTS;
    
    // Apply boundary constraints with small buffer to prevent edge sticking
    if (duck.position.left >= DUCK.MAX_LEFT) {
        duck.position.left = DUCK.MAX_LEFT - 0.1;
        duck.direction.x *= -1;
    }
    if (duck.position.left <= DUCK.MIN_LEFT) {
        duck.position.left = DUCK.MIN_LEFT + 0.1;
        duck.direction.x *= -1;
    }
    if (duck.position.top >= DUCK.MAX_TOP) {
        duck.position.top = DUCK.MAX_TOP - 0.1;
        duck.direction.y *= -1;
    }
    if (duck.position.top <= DUCK.MIN_TOP) {
        duck.position.top = DUCK.MIN_TOP + 0.1;
        duck.direction.y *= -1;
    }
}

function moveLinear(duck: Duck): void {
    duck.position.left += duck.direction.x * duck.speed;
    duck.position.top += duck.direction.y * duck.speed;
}

function moveCircular(duck: Duck): void {
    // Ensure required properties exist
    if (!duck.centerPoint || !duck.radius || duck.pathProgress === undefined) {
        duck.centerPoint = { left: duck.position.left, top: duck.position.top };
        duck.radius = 15;
        duck.pathProgress = 0;
    }
    
    // Smoother circular movement with consistent speed
    duck.pathProgress += duck.speed * 0.05;
    
    // Calculate new position
    const newLeft = duck.centerPoint.left + Math.cos(duck.pathProgress) * duck.radius;
    const newTop = duck.centerPoint.top + Math.sin(duck.pathProgress) * duck.radius;
    
    // Calculate direction based on position change (will be properly set in updateActualDirection)
    duck.direction.x = newLeft > duck.position.left ? 1 : -1;
    duck.direction.y = newTop > duck.position.top ? 1 : -1;
    
    // Update position
    duck.position.left = newLeft;
    duck.position.top = newTop;
}

function moveZigzag(duck: Duck): void {
    // Initialize zigzag properties if needed
    if (duck.zigzagAmplitude === undefined) {
        duck.zigzagAmplitude = 5;
    }
    
    // Move horizontally
    duck.position.left += duck.direction.x * duck.speed;
    
    // Use the baseline position with a sine wave for smooth zigzag
    duck.position.top = duck.position.top + Math.sin(duck.position.left * 0.1) * duck.speed * 0.5;
}

function moveRandom(duck: Duck): void {
    // Reduce random direction change frequency for smoother movement
    if (Math.random() < 0.01) { // 1% chance to change direction
        // Smoother transitions - don't change direction instantly
        duck.direction.x = duck.direction.x * 0.7 + (Math.random() > 0.5 ? 0.3 : -0.3);
        duck.direction.y = duck.direction.y * 0.7 + (Math.random() > 0.5 ? 0.15 : -0.15);
        
        // Normalize for consistent speed
        const magnitude = Math.sqrt(duck.direction.x * duck.direction.x + duck.direction.y * duck.direction.y);
        if (magnitude > 0) {
            duck.direction.x /= magnitude;
            duck.direction.y /= magnitude;
        }
    }
    duck.position.left += duck.direction.x * duck.speed;
    duck.position.top += duck.direction.y * duck.speed;
}

function updateDuckPosition(duck: Duck, duckElement: HTMLImageElement): void {
    // Smoothly update position
    duckElement.style.left = `${duck.position.left}%`;
    duckElement.style.top = `${duck.position.top}%`;
}

function updateActualDirection(duck: Duck, prevPosition: { left: number, top: number }): void {
    // Calculate actual movement direction based on position change
    if (Math.abs(duck.position.left - prevPosition.left) > 0.01) {
        duck.direction.x = duck.position.left > prevPosition.left ? 1 : -1;
    }
    
    if (Math.abs(duck.position.top - prevPosition.top) > 0.01) {
        duck.direction.y = duck.position.top > prevPosition.top ? 1 : -1;
    }
}

function handlePondDetection(duck: Duck, duckElement: HTMLImageElement): void {
    const { POND } = GAME_CONSTANTS;
    const isInPond = 
        duck.position.left >= POND.LEFT && 
        duck.position.left <= POND.RIGHT && 
        duck.position.top >= POND.TOP && 
        duck.position.top <= POND.BOTTOM;

    // Enter pond if not already in pond
    if (isInPond && !duck.inPond) {
        enterPond(duck, duckElement);
    } 
    // Exit pond if no longer in pond
    else if (!isInPond && duck.inPond) {
        exitPond(duck);
    }
    
    // Update duck sprite based on current direction
    if (isInPond) {
        updateDuckInPondSprite(duck, duckElement);
    } else {
        updateDuckSprite(duck, duckElement);
    }
}

function updateDuckInPondSprite(duck: Duck, duckElement: HTMLImageElement): void {
    // Always use current direction to determine sprite orientation
    const facingRight = duck.direction.x >= 0;
    
    // Determine which animation frame to use based on duck's relaxation state
    if (!duck.relaxState || duck.relaxState === 0) {
        duckElement.src = facingRight ? "../assets/duck/relax/a3.png" : "../assets/duck/relax/a1.png";
    } else if (duck.relaxState === 1) {
        duckElement.src = facingRight ? "../assets/duck/relax/a5.png" : "../assets/duck/relax/a7.png";
    } else if (duck.relaxState === 2) {
        duckElement.src = facingRight ? "../assets/duck/relax/a6.png" : "../assets/duck/relax/a8.png";
    }
}

function enterPond(duck: Duck, duckElement: HTMLImageElement): void {
    duck.inPond = true;
    duck.relaxState = 0; // Initial relaxation state
    
    // Clear any existing timers to prevent animation conflicts
    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
    
    // Set up relaxation animation sequence - just update the state, sprite will be updated in handlePondDetection
    duck.relaxTimer1 = setTimeout(() => {
        if (duck.inPond) {
            duck.relaxState = 1;      
            duck.relaxTimer2 = setTimeout(() => {
                if (duck.inPond) {
                    duck.relaxState = 2;
                }
            }, 5000);
        }
    }, 2000);
}

function exitPond(duck: Duck): void {
    duck.inPond = false;
    duck.relaxState = undefined; // Reset relaxation state
    
    // Clear timers to stop relaxation animations
    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
}

function updateDuckSprite(duck: Duck, duckElement: HTMLImageElement): void {
    // Update frame less frequently for smoother animation
    if (Math.random() < 0.1) { // Only update sprite 10% of the time
        duckElement.src = `../assets/duck/right-left/a${duck.frame + (duck.direction.x < 0 ? 2 : 0)}.png`;
        duck.frame = duck.frame === 1 ? 2 : 1;
    }
}
// Store movement intervals to clear them later
const duckMovementIntervals: NodeJS.Timeout[] = [];
// Function to set up duck movement
export function setupDuckMovement() {
    // Clear any existing intervals
    duckMovementIntervals.forEach(interval => clearInterval(interval));
    duckMovementIntervals.length = 0;  
    // Set up new intervals for each duck
    ducks.forEach(duck => {
        const interval = setInterval(() => moveDuck(duck), 150);
        duckMovementIntervals.push(interval);
    });
}