// Import necessary functions from other modules
import { initializeBaskets } from './Basket/baskets';

import { changeDuckMovementType as changeYellowDuckMovementType, updateDucksBasedOnCount as updateYellowDuckCount } from './DuckManager/duckYellowManager';
import { changeDuckMovementType as changeRedDuckMovementType, updateDucksBasedOnCount as updateRedDuckCount } from './DuckManager/duckRedManager';
import { changeDuckMovementType as changeNormalDuckMovementType, updateDucksBasedOnCount as updateNormalDuckCount } from './DuckManager/duckManager';

import { moveDuck as moveNormalDuck, setupDuckMovement as setupNormalDuckMovement } from './State/duckMovement';
import { moveDuck as moveYellowDuck, setupDuckMovement as setupYellowDuckMovement } from './State/duckMovementYellow';
import { moveDuck as moveRedDuck, setupDuckMovement as setupRedDuckMovement } from './State/duckMovementRed';

import { initializeGameStorage, updateCounters } from './Ultils/storage';

import { moveDuckToBasket, startWarningCycle } from './Egg/eggLaying';
import { setupRandomEggLaying } from './Egg/eggScheduler';
import { createRainEffect, updatedayandnightEffetc } from './weather/weatherEffect';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize game storage, ensuring saved data is loaded
    initializeGameStorage();
    updateCounters();
    startWarningCycle();

    updateNormalDuckCount();
    updateRedDuckCount();
    updateYellowDuckCount();

    setupNormalDuckMovement();
    setupRedDuckMovement();
    setupYellowDuckMovement();

    initializeAudio();
    setupRandomEggLaying();
    initializeBaskets();

    const canvas = document.getElementById("backgroundCanvas") as HTMLCanvasElement | null;
    const raindrops: any[] = [];

    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        // Ensure ctx is not null before calling the functions
        if (ctx !== null) {
            const ctx2D = ctx as CanvasRenderingContext2D;
            const canvas2d = canvas as HTMLCanvasElement;
            function environmentLoop() {
                // TypeScript now knows ctx is not null because we've checked it
                updatedayandnightEffetc(ctx2D, canvas2d);
                createRainEffect(ctx2D, raindrops, canvas2d);
                requestAnimationFrame(environmentLoop);
            }
            environmentLoop();
        }
    }
});


/**
 * Initializes and plays background music with volume control.
 * If autoplay is blocked, logs a message.
 */
function initializeAudio(): void {
    const bgMusic = document.getElementById("bgMusic") as HTMLAudioElement;
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => console.log("Autoplay blocked, user interaction required."));
    }
}
