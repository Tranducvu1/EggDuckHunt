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

// Execute when the HTML document has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game storage, ensuring saved data is loaded
    initializeGameStorage();
    // Update UI counters for eggs and coins
    updateCounters();
    // Start the warning cycle for duck movement
    startWarningCycle();
    // Update ducks for all types
    updateNormalDuckCount();
    updateRedDuckCount();
    updateYellowDuckCount();
    // Move each duck type
    setupNormalDuckMovement();
    setupRedDuckMovement();
    setupYellowDuckMovement();
    // Initialize background music and duck sounds
    initializeAudio();
    // Randomly generate eggs from ducks
    setupRandomEggLaying();
    // Set up baskets for egg collection
    initializeBaskets();
});
export { 
    moveNormalDuck,
    moveRedDuck,
    moveYellowDuck,
    moveDuckToBasket,
    changeNormalDuckMovementType,
    changeRedDuckMovementType,
    changeYellowDuckMovementType,
    setupRandomEggLaying as setuprandomlayegg
};

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
