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
  
  export interface PlayerState {
    eggsCollected: number;
    claimed: { [key: string]: boolean };
  }
  