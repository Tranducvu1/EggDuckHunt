// Import necessary functions from other modules
import { initializeBaskets } from './Basket/baskets';                // Import the function to initialize baskets
import {  updateAllDuckTypes, updateDucksBasedOnCount, updateDucksBasedOnCount as updateNormalDuckCount } from './DuckManager/duckManager';  // Import duck update functions
import { moveDuckToBasket, setupUFO, startWarningCycle } from './Egg/eggLaying';  // Import egg laying related functions
import { setupRandomEggLaying } from './Egg/eggScheduler';  // Import function to setup random egg laying
import { createRainEffect, updatedayandnightEffetc } from './weather/weatherEffect';  // Import weather effect functions (rain and day/night)
import { renderAllDayTask } from './Task/Claim';  // Import function to render tasks for the day
import { DuckType } from './Types/DuckType';  // Import DuckType enum for different duck types
import { setupNormalDuckMovement, setupRedDuckMovement, setupYellowDuckMovement } from './State/moveDuck';  // Import duck movement setup for normal ducks
import { createXPBar } from './Experient/Experient';
//@ts-ignore
import { updateDuckCount } from './components/ContractActions.js';
document.addEventListener('DOMContentLoaded', async () => {
       // Update counters based on loaded data
await updateDuckCount();
    // Start the warning cycle for the game (e.g., alerting the user about something)
    startWarningCycle();

    // Render tasks for the day (e.g., claim tasks for the player)
    renderAllDayTask();

    // Update the count of ducks based on DuckType enum (e.g., NORMAL ducks)
    updateAllDuckTypes()
    // set up  ufo
    setupUFO()
    // Set up normal duck movement logic
    setupNormalDuckMovement();
    //et up yellow duck movement logic
    setupYellowDuckMovement();
    //set up normal duck red logic
    setupRedDuckMovement();
    // Initialize audio for background music
    initializeAudio();

    // Set up random egg laying for the game
    setupRandomEggLaying();

    createXPBar();

    // Initialize baskets for collecting eggs
    initializeBaskets();

    // Canvas setup for rain and day/night effects
    const canvas = document.getElementById("backgroundCanvas") as HTMLCanvasElement | null;
    const raindrops: any[] = [];  // Array to store rain effects

    if (canvas) {
        const ctx = canvas.getContext("2d");  // Get the 2D context of the canvas

        // Ensure ctx is not null before calling functions
        if (ctx !== null) {
            const ctx2D = ctx as CanvasRenderingContext2D;  // Typecasting the context to CanvasRenderingContext2D
            const canvas2d = canvas as HTMLCanvasElement;  // Typecasting the canvas element

            // Function to loop and render the environment effects
            function environmentLoop() {
                // TypeScript knows ctx is not null because we've checked it
                updatedayandnightEffetc(ctx2D, canvas2d);  // Update the day/night cycle effect
                createRainEffect(ctx2D, raindrops, canvas2d);  // Create rain effect
                requestAnimationFrame(environmentLoop);  // Continue the loop for smooth animation
            }

            // Start the environment loop
            environmentLoop();
        }
    }
});

/**
 * Initializes and plays background music with volume control.
 * If autoplay is blocked, logs a message.
 */
function initializeAudio(): void {
    const bgMusic = document.getElementById("bgMusic") as HTMLAudioElement;  // Get the background music element
    if (bgMusic) {
        bgMusic.volume = 0.3;  // Set the volume to 30%
        bgMusic.play().catch(() => console.log("Autoplay blocked, user interaction required."));  // Play music or log error if autoplay is blocked
    }
}
