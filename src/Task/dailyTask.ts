import { Task } from "../Types/Task";


export const dailyTasks: Record<number, Task[]> = {
    1: [{ id: 'egg10', icon: "🥚", text: "Thu thập 10 trứng", reward: "5 coins", type: "egg", goal: 10 }],
    2: [{ id: 'egg20', icon: "🥚", text: "Thu thập 20 trứng", reward: "10 coins", type: "egg", goal: 20 }],
    3: [{ id: 'egg5', icon: "🥚", text: "Thu thập 5 trứng", reward: "3 coins", type: "egg", goal: 5 }],
    4: [{ id: 'egg15', icon: "🥚", text: "Thu thập 15 trứng", reward: "6 coins", type: "egg", goal: 15 }],
    5: [{ id: 'egg25', icon: "🥚", text: "Thu thập 25 trứng", reward: "8 coins", type: "egg", goal: 25 }],
    6: [{ id: 'egg30', icon: "🥚", text: "Thu thập 30 trứng", reward: "12 coins", type: "egg", goal: 30 }],
    7: [{ id: 'egg50', icon: "🥚", text: "Thu thập 50 trứng", reward: "20 coins", type: "egg", goal: 50 }]
  };