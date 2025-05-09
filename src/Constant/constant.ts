import { Duck } from "../Types/Duck";  // Importing Duck type
//@ts-ignore bỏ qua lỗi kiểu dữ liệu mà TypeScript 
import { state,updateDuckCount } from '../components/ContractActions.js';
updateDuckCount();

// Lấy số lượng vịt từ state.duckCount
const { yellow = 0, red = 0, white = 0 } = state.duckCount || {};

// Constants defining game-related values and settings
export const GAME_CONSTANTS = {
    // Pond boundaries where ducks can move
    POND: {
        LEFT: 0,           // Left boundary of the pond
        RIGHT: 100,        // Right boundary of the pond
        TOP: 70,           // Top boundary of the pond
        BOTTOM: 100        // Bottom boundary of the pond
    },
    
    // Constants related to egg and duck movement timing
    MOVEMENT: {
        MIN_EGG_TIME: 20000,        // Minimum time (in ms) before a duck lays an egg (20 seconds)
        MAX_EGG_TIME: 60000,        // Maximum time (in ms) before a duck lays an egg (60 seconds)
        EGG_LAYING_DURATION: 15000, // Duration (in ms) for egg laying (15 seconds)
        RETURN_DURATION: 5000      // Duration (in ms) for the duck to return to its starting position (5 seconds)
    },
    
    // Constants related to the ducks' movement positions and default number of ducks
    DUCK: {
        MIN_LEFT: 10,       // Minimum horizontal position for ducks
        MAX_LEFT: 80,       // Maximum horizontal position for ducks
        MIN_TOP: 30,        // Minimum vertical position for ducks
        MAX_TOP: 85,        // Maximum vertical position for ducks
        WHITECOUNT: white,  // Default number of white ducks at the start of the game
        REDCOUNT: red,      // Default number of red ducks at the start of the game
        YELLOWCOUNT: yellow // Default number of yellow ducks at the start of the game
    }
};

// Array containing possible movement types for ducks
export const MOVEMENT_TYPES: Duck["movementType"][] = ["linear", "circular", "zigzag", "random", "fly"];

// The contract address on the blockchain for interactions (e.g., game transactions, NFT management)
export const CONTRACT_ADDRESS = "0xeAef18c7A7228FBA33D93ce2f614a47DA0878F82";
