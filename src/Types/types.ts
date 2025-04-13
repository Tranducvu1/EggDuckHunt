/**
 * Represents a basket where ducks can lay eggs.
 */
export interface Basket {
    id: string;       // Unique identifier for the basket
    left: number;     // Position from the left (percentage or pixels)
    top: number;      // Position from the top (percentage or pixels)
    position: Position; // Position object for easier access
}
export interface Position {
    left: number;
    top: number;
}
/**
 * Represents an egg that appears in the game.
 */
export interface Egg {
    id: string;       // Unique identifier for the egg
    left: number;     // Position from the left (percentage or pixels)
    top: number;      // Position from the top (percentage or pixels)
}

/**
 * Represents a duck with its movement, position, and interaction details.
 */
export type MovementType = "linear" | "circular" | "zigzag" | "random";

export interface Duck {
    id: string;              // Unique identifier for the duck
    size: number; 
    position: { left: number; top: number }; // Current position of the duck
    direction: { x: number; y: number };     // Movement direction (vector)
    speed: number;           // Speed of the duck's movement
    frame: number;           // Animation frame for sprite handling
    startTime?: number;
    restDuration?: number; // Duration for which the duck rests
    moving: boolean;         // Whether the duck is currently moving
    inPond: boolean;         // Whether the duck is in the pond
    relaxState?: number; 
    movementType: MovementType;
    pathProgress?: number;   // Used for circular/zigzag movements to track progress
    centerPoint?: { left: number; top: number }; // Center point for circular movement
    radius?: number;         // Radius for circular movement
    zigzagAmplitude?: number; // Amplitude for zigzag movement
    
    relaxTimer1?: ReturnType<typeof setTimeout>; // Timer for relaxation between movements
    relaxTimer2?: ReturnType<typeof setTimeout>; // Secondary timer for delays
    
    originalPosition?: { left: number; top: number }; // Original position for reset
    
    selectedBasket: Basket | null; // Which basket the duck is heading to or null if none
    autoMoveInterval: ReturnType<typeof setTimeout> | undefined; // Interval ID for automated movement
}


export interface PlayerData {
    id: number;
    name: string;
    token: string;
    whiteDuck: number;
    redDuck: number;
    yellowDuck: number;
    coins: number;
    eth: number;
    egg: number;
  }
  