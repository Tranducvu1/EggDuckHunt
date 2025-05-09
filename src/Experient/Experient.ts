// Initialize player's starting level
let level = 3;
// Current XP the player has
export let currentXP = 0;
// XP required to level up; initially 10
let xpPerLevel = 10;

/**
 * Creates the XP bar UI based on the current required XP per level.
 * Each unit represents one XP point needed to level up.
 */
export function createXPBar(): void {
  const xpBar = document.getElementById("xpBar");
  if (!xpBar) return; // Exit if the XP bar element is not found
  xpBar.innerHTML = ""; // Clear existing XP units
  // Create and append XP units (empty blocks)
  for (let i = 0; i < xpPerLevel; i++) {
    const unit = document.createElement("div");
    unit.classList.add("xp-unit"); // Add a class for styling
    xpBar.appendChild(unit);       // Add unit to the XP bar
  }
}

/**
 * Updates the XP bar fill status and handles level-up logic.
 * Fills XP units based on current XP and levels up when XP is full.
 */
export function updateXPBar(): void {
  const xpUnits = document.querySelectorAll(".xp-unit");

  // Fill or unfill XP units based on currentXP
  xpUnits.forEach((unit, index) => {
    if (index < currentXP) {
      unit.classList.add("filled");   // Mark unit as filled
    } else {
      unit.classList.remove("filled"); // Clear the fill
    }
  });

  // Level up if XP threshold is reached
  if (currentXP >= xpPerLevel) {
    level++;              // Increase player level
    currentXP = 0;        // Reset XP
    xpPerLevel = level * 10; // Increase XP requirement for next level

    // Update level display in the UI
    document.getElementById("level")!.textContent = level.toString();

    // Rebuild XP bar for the new level
    createXPBar();
    updateXPBar();
  }
}

/**
 * Adds XP to the player and triggers UI update.
 * @param xp - amount of XP to add
 */
export function addXP(xp: number): void {
  currentXP += xp;  // Increase current XP
  updateXPBar();    // Refresh XP bar and check for level up
}
