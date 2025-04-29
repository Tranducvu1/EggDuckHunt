
// // Định nghĩa cấu trúc để lưu trữ thông tin cấu hình cho từng loại vịt
// interface DuckTypeConfig {
//     idPrefix: string;
//     className: string;
//     imagePath: string;
//     storageKey: string;
// }

// export interface Basket {
//     id: string;       // Unique identifier for the basket
//     left: number;     // Position from the left (percentage or pixels)
//     top: number;      // Position from the top (percentage or pixels)
//     position: Position; // Position object for easier access
// }
// export interface Position {
//     left: number;
//     top: number;
// }
// /**
//  * Represents an egg that appears in the game.
//  */
// export interface Egg {
//     id: string;       // Unique identifier for the egg
//     left: number;     // Position from the left (percentage or pixels)
//     top: number;      // Position from the top (percentage or pixels)
// }

// /**
//  * Represents a duck with its movement, position, and interaction details.
//  */
// export type MovementType = "linear" | "circular" | "zigzag" | "random";

// export interface Duck {
//     id: string;              // Unique identifier for the duck
//     size: number; 
//     position: { left: number; top: number }; // Current position of the duck
//     direction: { x: number; y: number };     // Movement direction (vector)
//     speed: number;           // Speed of the duck's movement
//     frame: number;           // Animation frame for sprite handling
//     startTime?: number;
//     restDuration?: number; // Duration for which the duck rests
//     moving: boolean;         // Whether the duck is currently moving
//     inPond: boolean;         // Whether the duck is in the pond
//     relaxState?: number; 
//     movementType: MovementType;
//     pathProgress?: number;   // Used for circular/zigzag movements to track progress
//     centerPoint?: { left: number; top: number }; // Center point for circular movement
//     radius?: number;         // Radius for circular movement
//     zigzagAmplitude?: number; // Amplitude for zigzag movement
    
//     relaxTimer1?: ReturnType<typeof setTimeout>; // Timer for relaxation between movements
//     relaxTimer2?: ReturnType<typeof setTimeout>; // Secondary timer for delays
    
//     originalPosition?: { left: number; top: number }; // Original position for reset
    
//     selectedBasket: Basket | null; // Which basket the duck is heading to or null if none
//     autoMoveInterval: ReturnType<typeof setTimeout> | undefined; // Interval ID for automated movement
// }

// // Định nghĩa kiểu DuckType để quản lý các loại vịt
// export type DuckType = 'normal' | 'red' | 'yellow';

// // Cấu hình cho từng loại vịt
// export const DUCK_CONFIGS: Record<DuckType, DuckTypeConfig> = {
//     normal: {
//         idPrefix: 'duck',
//         className: 'duck',
//         imagePath: '../../assets/duck/right-left/a',
//         storageKey: 'duckCount'
//     },
//     red: {
//         idPrefix: 'redduck',
//         className: 'redduck',
//         imagePath: '../../assets/duck/right-left-red/a',
//         storageKey: 'redDuckCount'
//     },
//     yellow: {
//         idPrefix: 'yellowduck',
//         className: 'yellowduck',
//         imagePath: '../../assets/duck/right-left-yellow/a',
//         storageKey: 'yellowDuckCount'
//     }
// };

// // Tạo các mảng chứa vịt cho từng loại
// export const ducks: Record<DuckType, Duck[]> = {
//     normal: [],
//     red: [],
//     yellow: []
// };




// export interface PlayerData {
//     id: number;
//     name: string;
//     token: string;
//     whiteDuck: number;
//     redDuck: number;
//     yellowDuck: number;
//     coins: number;
//     eth: number;
//     egg: number;
//   }
  
// //save task
// export interface Task {
//     id: string; // Unique identifier for the task
//     icon: string; // Icon representing the task
//     text: string; // Description of the task
//     reward: string; // Reward for completing the task
//     type: string; // Type of task (e.g., egg, duck, etc.)
//     goal: number; // Goal to achieve for the task
// }

// // Trạng thái người chơi
// export interface PlayerState {
//     eggsCollected: number;
//     claimed: { [key: string]: boolean };
//   }