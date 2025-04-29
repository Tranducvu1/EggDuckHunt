// Interface defining a Task object
export interface Task {
  id: string;     // Unique identifier for the task
  icon: string;   // Icon representing the task (e.g., a visual symbol or image path)
  text: string;   // Description or title of the task
  reward: string; // The reward associated with completing the task (could be coins, items, etc.)
  type: string;   // The category or type of the task (e.g., "daily", "achievement", etc.)
  goal: number;   // The target or goal to be achieved to complete the task (e.g., number of eggs collected)
}
