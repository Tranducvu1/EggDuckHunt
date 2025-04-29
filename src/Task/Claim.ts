
import { PlayerState } from "../Types/Player";
import { dailyTasks } from "./dailyTask";

const dailyofweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today: number = new Date().getDay(); // 0 = Sunday ... 6 = Saturday
const todayIndex: number = today === 0 ? 7 : today; // đổi 0 => 7 để khớp dailyTasks

let playerstate: PlayerState = {
  claimed: {},
  eggsCollected: 0
};

// Load từ localStorage
const savedstate = localStorage.getItem("playerstate");
if (savedstate) {
  playerstate = JSON.parse(savedstate);
}

// Lưu vào localStorage
function savePlayerState(): void {
  localStorage.setItem("playerstate", JSON.stringify(playerstate));
}

export function renderAllDayTask(): void {
  const container = document.getElementById("listtasks");
  const eggCounter = document.getElementById("eggCounter");

  if (!container) return;

  container.innerHTML = "";

  for (let i = 1; i <= 7; i++) {
    const dayName = dailyofweek[i % 7];
    const tasks = dailyTasks[i] || [];

    const dayDiv = document.createElement("div");
    dayDiv.className = "task-day" + (i === todayIndex ? " today" : "");
    dayDiv.innerHTML = `<h4>${dayName}</h4>`;

    tasks.forEach(task => {
      const isCompleted = task.type === "egg" && playerstate.eggsCollected >= task.goal;
      const isClaimed = !!playerstate.claimed[task.id];
      const buttonText = isClaimed ? "Đã nhận" : isCompleted ? "Nhận" : "Chưa hoàn thành";

      const taskHTML = `
        <div class="task-item">
          <div>${task.icon} ${task.text}</div>
          <div><small>🎁 ${task.reward}</small></div>
          <button data-task-id="${task.id}" ${!isCompleted || isClaimed ? "disabled" : ""}>${buttonText}</button>
        </div>
      `;
      dayDiv.innerHTML += taskHTML;
    });

    container.appendChild(dayDiv);
  }

  // Gán sự kiện click nhận thưởng
  document.querySelectorAll("button[data-task-id]").forEach(btn => {
    btn.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLButtonElement;
      const taskId = target.dataset.taskId;
      if (taskId) {
        playerstate.claimed[taskId] = true;
        savePlayerState();
        renderAllDayTask();

        // Get current egg count from localStorage and update
        let eggCount = parseInt(localStorage.getItem("eggCount") || "0");
        const allTasks = Object.values(dailyTasks).flat();
        const taskGoal = allTasks.find(task => task.id === taskId)?.goal || 0;

        // Update the egg count with the task goal
        eggCount += taskGoal;
      
        updateEggUI(eggCount);
        localStorage.setItem("eggCount", eggCount.toString());

        alert("🎉 Nhận thưởng thành công!");
      }
    });
  });
}

function updateEggUI(newEggCount: number) {
  const eggMain = document.getElementById("eggCounter");

  if (eggMain) eggMain.textContent = newEggCount.toString();
}

export function collectEgg() {
  playerstate.eggsCollected += 1;
  savePlayerState();         // save state to localStorage
  renderAllDayTask();        // update UI
}
