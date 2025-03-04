
document.addEventListener('DOMContentLoaded', () => {
    initializeGameStorage();
    updateCounters();
});
function initializeGameStorage() {
    if (localStorage.getItem('eggCount') === null) {
        localStorage.setItem('eggCount', '0');
    }
    if (localStorage.getItem('coinCount') === null) {
        localStorage.setItem('coinCount', '0');
    }
}

interface Basket {
    left: number;
    top: number;
}

interface Egg {
    id: String,
    left: number;
     top: number 
}

interface Duck {
    id: string;
    position: { left: number; top: number };
    direction: { x: number; y: number };
    speed: number;
    frame: number;
    basket: Basket;
    moving: boolean;
    inPond: boolean;
    movementType: "linear" | "circular" | "zigzag" | "random";
    pathProgress?: number;
    centerPoint?: { left: number; top: number };
    radius?: number;
    zigzagAmplitude?: number;
    relaxTimer1?: ReturnType<typeof setTimeout>;
    relaxTimer2?: ReturnType<typeof setTimeout>;
    originalPosition?: { left: number; top: number };
}

let eggCount: number = 0;
let coinCount: number = 0;

// Updated duck definitions with new movement types
const ducks: Duck[] = [
    { 
        id: "duck1", 
        position: { left: 10, top: 40 }, 
        direction: { x: 1, y: 0 }, 
        speed: 0.3, 
        frame: 1, 
        basket: { left: 46, top: 72 }, 
        moving: true, 
        inPond: false,
        movementType: "zigzag",
        zigzagAmplitude: 5
    },
    { 
        id: "duck2", 
        position: { left: 50, top: 60 }, 
        direction: { x: -1, y: 0 }, 
        speed: 0.2, 
        frame: 1, 
        basket: { left: 51, top: 74 }, 
        moving: true, 
        inPond: false,
        movementType: "circular",
        centerPoint: { left: 50, top: 50 },
        radius: 15,
        pathProgress: 0
    },
    { 
        id: "duck3", 
        position: { left: 30, top: 80 }, 
        direction: { x: 1, y: 0 }, 
        speed: 0.25, 
        frame: 1, 
        basket: { left: 56, top: 76 }, 
        moving: true, 
        inPond: false,
        movementType: "random"
    },
    
];

// const ducks: Duck[] = [
//     { 
//         id: "duck1", 
//         position: { left: 10, top: 40 }, 
//         direction: { x: 1, y: 0 }, 
//         speed: 0.3, 
//         frame: 1, 
//         basket: { left: 46, top: 72 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "zigzag",
//         zigzagAmplitude: 5
//     },
//     { 
//         id: "duck2", 
//         position: { left: 50, top: 60 }, 
//         direction: { x: -1, y: 0 }, 
//         speed: 0.2, 
//         frame: 1, 
//         basket: { left: 51, top: 74 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "circular",
//         centerPoint: { left: 50, top: 50 },
//         radius: 15,
//         pathProgress: 0
//     },
//     { 
//         id: "duck3", 
//         position: { left: 70, top: 80 }, 
//         direction: { x: 1, y: 0 }, 
//         speed: 0.25, 
//         frame: 1, 
//         basket: { left: 56, top: 76 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "random"
//     },
//     { 
//         id: "duck4", 
//         position: { left: 30, top: 60 }, 
//         direction: { x: 1, y: 0 }, 
//         speed: 0.25, 
//         frame: 1, 
//         basket: { left: 56, top: 76 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "random"
//     },
//     { 
//         id: "duck5", 
//         position: { left: 30, top: 80 }, 
//         direction: { x: 1, y: 0 }, 
//         speed: 0.25, 
//         frame: 1, 
//         basket: { left: 56, top: 76 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "random"
//     },
//     { 
//         id: "duck6", 
//         position: { left: 15, top: 50 }, 
//         direction: { x: -1, y: 0 }, 
//         speed: 0.3, 
//         frame: 1, 
//         basket: { left: 42, top: 70 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "zigzag",
//         zigzagAmplitude: 6
//     },
//     { 
//         id: "duck7", 
//         position: { left: 60, top: 65 }, 
//         direction: { x: 1, y: 0 }, 
//         speed: 0.35, 
//         frame: 1, 
//         basket: { left: 49, top: 75 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "circular",
//         centerPoint: { left: 55, top: 55 },
//         radius: 12,
//         pathProgress: 0
//     },
//     { 
//         id: "duck8", 
//         position: { left: 25, top: 55 }, 
//         direction: { x: -1, y: 0 }, 
//         speed: 0.28, 
//         frame: 1, 
//         basket: { left: 45, top: 73 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "zigzag",
//         zigzagAmplitude: 4
//     },
//     { 
//         id: "duck9", 
//         position: { left: 75, top: 45 }, 
//         direction: { x: -1, y: 0 }, 
//         speed: 0.22, 
//         frame: 1, 
//         basket: { left: 55, top: 70 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "random"
//     },
//     { 
//         id: "duck10", 
//         position: { left: 40, top: 50 }, 
//         direction: { x: 1, y: 0 }, 
//         speed: 0.27, 
//         frame: 1, 
//         basket: { left: 50, top: 72 }, 
//         moving: true, 
//         inPond: false,
//         movementType: "circular",
//         centerPoint: { left: 50, top: 50 },
//         radius: 10,
//         pathProgress: 0
//     }
// ];

document.addEventListener("DOMContentLoaded", () => {
    const bgMusic = document.getElementById("bgMusic") as HTMLAudioElement;
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => console.log("Tự động phát bị chặn, yêu cầu thao tác từ người dùng."));
    }
});

function moveDuck(duck: Duck): void {
    if (!duck.moving) return;
    const duckElement = document.getElementById(duck.id) as HTMLImageElement;
    if (!duckElement) return;

    // Calculate new position based on movement type
    switch (duck.movementType) {
        case "linear":
            // Simple linear movement (left-right)
            duck.position.left += duck.direction.x * duck.speed;
            duck.position.top += duck.direction.y * duck.speed;
            
            // Bounce off edges
            if (duck.position.left >= 80 || duck.position.left <= 10) {
                duck.direction.x *= -1;
            }
            if (duck.position.top >= 85 || duck.position.top <= 30) {
                duck.direction.y *= -1;
            }
            break;
            
        case "circular":
            // Circular movement
            if (duck.pathProgress === undefined || duck.centerPoint === undefined || duck.radius === undefined) {
                // Default values if not defined
                duck.pathProgress = 0;
                duck.centerPoint = { left: 50, top: 50 };
                duck.radius = 15;
            }
            
            duck.pathProgress += duck.speed * 0.05;
            duck.position.left = duck.centerPoint.left + Math.cos(duck.pathProgress) * duck.radius;
            duck.position.top = duck.centerPoint.top + Math.sin(duck.pathProgress) * duck.radius;
            
            // Update direction based on movement
            duck.direction.x = Math.cos(duck.pathProgress + Math.PI/2) > 0 ? 1 : -1;
            break;
            
        case "zigzag":
            // Zigzag movement
            duck.position.left += duck.direction.x * duck.speed;
            
            if (duck.zigzagAmplitude === undefined) {
                duck.zigzagAmplitude = 5;
            }
            
            // Create zigzag pattern using sine wave
            duck.position.top = duck.position.top + Math.sin(duck.position.left * 0.1) * duck.speed * 0.5;
            
            // Bounce off horizontal edges
            if (duck.position.left >= 80 || duck.position.left <= 10) {
                duck.direction.x *= -1;
            }
            
            // Keep within vertical bounds
            if (duck.position.top >= 85) duck.position.top = 85;
            if (duck.position.top <= 30) duck.position.top = 30;
            break;
            
        case "random":
            // Random direction changes
            if (Math.random() < 0.02) {
                // 2% chance to change direction each frame
                duck.direction.x = Math.random() > 0.5 ? 1 : -1;
                duck.direction.y = Math.random() > 0.5 ? 0.5 : -0.5;
            }
            
            duck.position.left += duck.direction.x * duck.speed;
            duck.position.top += duck.direction.y * duck.speed;
            
            // Bounce off edges
            if (duck.position.left >= 80 || duck.position.left <= 10) {
                duck.direction.x *= -1;
            }
            if (duck.position.top >= 85 || duck.position.top <= 30) {
                duck.direction.y *= -1;
            }
            break;
    }

    // Update duck position on screen
    duckElement.style.left = `${duck.position.left}%`;
    duckElement.style.top = `${duck.position.top}%`;

    // Check if duck is in pond
    const pondLeft = 42, pondRight = 55, pondTop = 78;
    const isInPond = duck.position.left >= pondLeft && duck.position.left <= pondRight && duck.position.top >= pondTop;

    if (isInPond && !duck.inPond) {
        duck.inPond = true;
        duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a3.png" : "../assets/duck/relax/a1.png";
        duck.relaxTimer1 = setTimeout(() => {
            if (duck.inPond) {
                duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a5.png" : "../assets/duck/relax/a7.png";
                duck.relaxTimer2 = setTimeout(() => {
                    if (duck.inPond) {
                        duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a6.png" : "../assets/duck/relax/a8.png";
                    }
                }, 2000);
            }
        }, 2000);
    } else if (!isInPond && duck.inPond) {
        duck.inPond = false;
        if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
        if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
    }

    // Update duck sprite based on movement direction (only when not in pond)
    if (!isInPond) {
        duckElement.src = `../assets/duck/right-left/a${duck.frame + (duck.direction.x === -1 ? 2 : 0)}.png`;
        duck.frame = duck.frame === 1 ? 2 : 1;
    }
}

function moveDuckToBasket(duck: Duck): void {
    if (!duck.moving) return;
    duck.moving = false;
    const duckElement = document.getElementById(duck.id) as HTMLImageElement;
    if (!duckElement) return;
    
    duck.originalPosition = { left: duck.position.left, top: duck.position.top };
    
    // Calculate target position (basket position)
    const targetLeft = duck.basket.left - 0.2;
    const targetTop = duck.basket.top - 2;
    
    // Determine path type randomly for basket approach
    const pathType = Math.random() < 0.5 ? "direct" : "arc";
    
    let startTime = Date.now();
    const duration = 15000; // 3 seconds to complete the movement
    const startPosition = { left: duck.position.left, top: duck.position.top };
    
    // For arc movement, calculate a control point
    const controlPoint = {
        left: (startPosition.left + targetLeft) / 2 + (Math.random() * 20 - 10),
        top: Math.min(startPosition.top, targetTop) - 10 - Math.random() * 10
    };
    
    // Update duck sprite based on initial horizontal direction
    const initialDirection = targetLeft > duck.position.left ? 1 : -1;
    duckElement.src = `../assets/duck/right-left/a${initialDirection > 0 ? 1 : 3}.png`;
    
    let moveInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        if (progress >= 1) {
            // Movement complete
            clearInterval(moveInterval);
            
            // Set duck to final position
            duck.position.left = targetLeft;
            duck.position.top = targetTop;
            duckElement.style.left = `${duck.position.left}%`;
            duckElement.style.top = `${duck.position.top}%`;
            const duckSound = document.getElementById("duckSound") as HTMLAudioElement;
            if(duckSound){
                duckSound.play().catch(() => console.log("Tự động phát bị chặn, yêu cầu thao tác từ người dùng."));
            }
            layEgg(duck, duckElement);
            return;
        }
        
        // Calculate new position based on path type
        if (pathType === "direct") {
            // Linear interpolation for direct path
            duck.position.left = startPosition.left + (targetLeft - startPosition.left) * progress;
            duck.position.top = startPosition.top + (targetTop - startPosition.top) * progress;
        } else {
            // Quadratic Bezier curve for arc path
            const t = progress;
            const mt = 1 - t;
            
            duck.position.left = mt * mt * startPosition.left + 2 * mt * t * controlPoint.left + t * t * targetLeft;
            duck.position.top = mt * mt * startPosition.top + 2 * mt * t * controlPoint.top + t * t * targetTop;
        }
        
        // Update duck position
        duckElement.style.left = `${duck.position.left}%`;
        duckElement.style.top = `${duck.position.top}%`;
        
        // Update duck sprite based on horizontal direction
        const currentDirection = targetLeft > startPosition.left ? 1 : -1;
    if (duck.direction.x !== currentDirection) {
        duck.direction.x = currentDirection;
        duckElement.src = `../assets/duck/right-left/a${currentDirection === 1 ? 1 : 3}.png`;
    }

        duckElement.src = `../assets/duck/right-left/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
        duck.frame = duck.frame === 1 ? 2 : 1;
        
    }, 100);
}

function layEgg(duck: Duck, duckElement: HTMLImageElement): void {
    setTimeout(() => {
        const egg = document.createElement("img");
        egg.src = "../assets/duck/egg.png";
        egg.classList.add("egg-basket");
        egg.style.position = "absolute";
        egg.style.width = "30px";
        egg.style.left = `${duck.basket.left + 0.5}%`;
        egg.style.top = `${duck.basket.top - 1}%`;
        egg.style.cursor = "pointer"; // Add pointer cursor to indicate clickability

        // Add click event listener to the egg
        egg.addEventListener('click', () => {
            // Increment egg and coin count
            incrementEggAndCoin();
       //     coinCount += 10;

            // Update counters in the UI
            (document.querySelector("#eggCounter span") as HTMLElement).innerText = eggCount.toString();
            (document.querySelector("#coinCounter span") as HTMLElement).innerText = coinCount.toString();

            // Remove the egg from the DOM
            document.body.removeChild(egg);
        });

        document.body.appendChild(egg);
        
        setTimeout(() => returnToOriginal(duck, duckElement), 2000);
    }, 1000);
}
function returnToOriginal(duck: Duck, duckElement: HTMLImageElement): void {
    if (!duck.originalPosition) return;
    
    // Create a path back to the original position
    const startPosition = { left: duck.position.left, top: duck.position.top };
    const targetPosition = duck.originalPosition;
    
    let startTime = Date.now();
    const duration = 5000; // 2 seconds to return
    
    const returnInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        if (progress >= 1) {
            clearInterval(returnInterval);
            duck.position.left = targetPosition.left;
            duck.position.top = targetPosition.top;
            duck.moving = true;
            return;
        }
        
        // Linear interpolation for return journey
        duck.position.left = startPosition.left + (targetPosition.left - startPosition.left) * progress;
        duck.position.top = startPosition.top + (targetPosition.top - startPosition.top) * progress;
        
        duckElement.style.left = `${duck.position.left}%`;
        duckElement.style.top = `${duck.position.top}%`;
        
        // Update duck sprite based on horizontal direction
       
        const currentDirection = duck.position.left  > startPosition.left ? 1 : -1;
        if (duck.direction.x !== currentDirection) {
            duck.direction.x = currentDirection;
            duckElement.src = `../assets/duck/right-left/a${currentDirection === 1 ? 1 : 3}.png`;
        }
        
        duckElement.src = `../assets/duck/right-left/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
        duck.frame = duck.frame === 1 ? 2 : 1;
    }, 50);
}

function changeDuckMovementType(duckId: string, newMovementType: Duck["movementType"]): void {
    const duck = ducks.find(d => d.id === duckId);
    if (!duck) return;
    
    duck.movementType = newMovementType;
    
    // Reset any movement-specific properties
    if (newMovementType === "circular") {
        duck.centerPoint = { 
            left: duck.position.left, 
            top: duck.position.top 
        };
        duck.radius = 15;
        duck.pathProgress = 0;
    }
}

// Start duck movement
ducks.forEach(duck => setInterval(() => moveDuck(duck), 100));

// Periodically send ducks to lay eggs
setInterval(() => {
    const movingDucks = ducks.filter(duck => duck.moving);
    if (movingDucks.length > 0) {
        moveDuckToBasket(movingDucks[Math.floor(Math.random() * movingDucks.length)]);
    }
}, 10000);

function incrementEggAndCoin() {
    // Get current counts from localStorage
    let storedEggCount = parseInt(localStorage.getItem('eggCount') || '0');
   
    // Increment counts
     eggCount++;

    
    // Save to localStorage
    localStorage.setItem('eggCount', eggCount.toString());
   
    // Update UI
    updateCounters();
}
function updateCounters() {
    const eggCountElement = document.querySelector("#eggCounter span") as HTMLElement;
    const coinCountElement = document.querySelector("#coinCounter span") as HTMLElement;
    
    const storedEggCount = parseInt(localStorage.getItem('eggCount') || '0');
    const storedCoinCount = parseInt(localStorage.getItem('coinCount') || '0');
    
    eggCountElement.innerText = storedEggCount.toString();
    coinCountElement.innerText = storedCoinCount.toString();
}
