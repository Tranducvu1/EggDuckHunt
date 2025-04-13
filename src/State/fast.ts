let isBoosting = false;

// Hàm khởi động boost mỗi 5 phút
function startWarningCycle() {
  setInterval(() => {
    triggerWarning();
  }, 0.1 * 60 * 1000); // 5 phút
}

function triggerWarning() {
  const body = document.body;
  body.classList.add("screen-warning");

  isBoosting = true;

  // Gỡ warning sau 10 giây
  setTimeout(() => {
    body.classList.remove("screen-warning");
    isBoosting = false;
  }, 10000);
}

export function isBoostingNow(): boolean {
  return isBoosting;
}

// Khởi chạy khi load game
window.addEventListener("DOMContentLoaded", () => {
  startWarningCycle();
});
