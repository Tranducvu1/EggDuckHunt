import { Basket } from './Basket';
import { DuckType } from './DuckType';

export type MovementType = "linear" | "circular" | "zigzag" | "random" | "fly";

export interface Duck {
  id: string;
  size: number;
  position: { left: number; top: number };
  direction: { x: number; y: number };
  speed: number;
  frame: number;
  startTime?: number;
  restDuration?: number;
  moving: boolean;
  inPond: boolean;
  relaxState?: number;
  level: number;
  movementType: MovementType;
  pathProgress?: number;
  centerPoint?: { left: number; top: number };
  radius?: number;
  zigzagAmplitude?: number;
  relaxTimer1?: ReturnType<typeof setTimeout>;
  relaxTimer2?: ReturnType<typeof setTimeout>;
  originalPosition?: { left: number; top: number };
  selectedBasket: Basket | null;
  autoMoveInterval: ReturnType<typeof setTimeout> | undefined;
  type: DuckType;

}
