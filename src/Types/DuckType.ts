// Defines the configuration for each duck type
export interface DuckTypeConfig {
  idPrefix: string;    // Prefix for the ID of each duck type
  className: string;   // CSS class for the duck type
  imagePath: string;   // Path to the duck image
  storageKey: string;  // Key for storing the duck type information in sessionStorage or localStorage
}

// Enum representing available duck types
export enum DuckType {
  RED = "red",       // Red duck
  YELLOW = "yellow", // Yellow duck
  WHITE = "white"  // Normal duck
}
