// game.ts

import { Duck, Position } from '../Types/types';
import { baskets } from '../Basket/baskets';
import { incrementEggAndCoin } from '../Ultils/storage';
import { GAME_CONSTANTS } from '../Constant/constant';


let isBoosting = false;

// Hàm khởi động boost mỗi 6 giây
export function startWarningCycle() {
    // Đặt khoảng thời gian đúng là 6 giây
    setInterval(() => {
      triggerWarning();
      console.log("Boosting activated!"); // Thông báo khi kích hoạt boost
    }, 60000);  // 6000ms = 6s
  }
  function triggerWarning() {
    // Thay vì thêm class vào body, tạo một phần tử riêng
    const warningElement = document.createElement('div');
    warningElement.classList.add('screen-warning');
    warningElement.id = 'screenWarning';
    document.body.appendChild(warningElement);
    
    console.log("Warning triggered!"); // Thông báo khi kích hoạt cảnh báo
    isBoosting = true;
  
    // Gỡ warning sau 10 giây
    setTimeout(() => {
      const warningElement = document.getElementById('screenWarning');
      if (warningElement) {
        document.body.removeChild(warningElement);
      }
      isBoosting = false;
    }, 10000);
  }

export function isBoostingNow(): boolean {
  return isBoosting;
}


function getBoostedTime(originalTime: number): number {
    return isBoostingNow() ? originalTime * 0.5 : originalTime;
  }

// Logic di chuyển vịt đến rổ
export function moveDuckToBasket(duck: Duck): void {
  if (!duck.moving) return;
  duck.moving = false;

  const duckElement = document.getElementById(duck.id) as HTMLImageElement;
  if (!duckElement) return;

  // Lưu vị trí gốc
  duck.originalPosition = { left: duck.position.left, top: duck.position.top };

  // Chọn rổ ngẫu nhiên
  const selectedBasket = baskets[Math.floor(Math.random() * baskets.length)];
  duck.selectedBasket = selectedBasket;

  // Đặt vị trí đích
  const targetLeft = selectedBasket.position.left;
  const targetTop = selectedBasket.position.top - 2;

  // Xác định loại đường đi ngẫu nhiên cho việc tiếp cận rổ
  const pathType = Math.random() < 0.5 ? "direct" : "arc";

  animateDuckToBasket(duck, duckElement, targetLeft, targetTop, pathType);
}

function animateDuckToBasket(
  duck: Duck,
  duckElement: HTMLImageElement,
  targetLeft: number,
  targetTop: number,
  pathType: string
): void {
  const startTime = Date.now();
  const duration = getBoostedTime(GAME_CONSTANTS.MOVEMENT.EGG_LAYING_DURATION);
  const startPosition = { left: duck.position.left, top: duck.position.top };

  // Tính toán điểm điều khiển cho đường cong parabol
  const controlPoint = {
    left: (startPosition.left + targetLeft) / 2 + (Math.random() * 20 - 10),
    top: Math.min(startPosition.top, targetTop) - 10 - Math.random() * 10
  };

  // Cập nhật sprite của vịt dựa trên hướng di chuyển
  const initialDirection = targetLeft > duck.position.left ? 1 : -1;
  duckElement.src = `../assets/duck/right-left-yellow/a${initialDirection > 0 ? 1 : 3}.png`;

  const moveInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    if (progress >= 1) {
      // Hoàn thành di chuyển
      clearInterval(moveInterval);

      // Cập nhật vị trí cuối của vịt
      duck.position.left = targetLeft;
      duck.position.top = targetTop;
      duckElement.style.left = `${duck.position.left}%`;
      duckElement.style.top = `${duck.position.top}%`;

      playDuckSound();
      layEgg(duck, duckElement);
      return;
    }

    calculateMovementPosition(duck, startPosition, targetLeft, targetTop, controlPoint, pathType, progress);

    // Cập nhật vị trí của vịt
    duckElement.style.left = `${duck.position.left}%`;
    duckElement.style.top = `${duck.position.top}%`;

    // Cập nhật sprite của vịt
    updateMovingDuckSprite(duck, duckElement, startPosition);

  }, 100);
}

function calculateMovementPosition(
  duck: Duck,
  startPosition: Position,
  targetLeft: number,
  targetTop: number,
  controlPoint: Position,
  pathType: string,
  progress: number
): void {
  if (pathType === "direct") {
    // Di chuyển theo đường thẳng
    duck.position.left = startPosition.left + (targetLeft - startPosition.left) * progress;
    duck.position.top = startPosition.top + (targetTop - startPosition.top) * progress;
  } else {
    // Di chuyển theo đường cong Bezier
    const t = progress;
    const mt = 1 - t;

    duck.position.left = mt * mt * startPosition.left + 2 * mt * t * controlPoint.left + t * t * targetLeft;
    duck.position.top = mt * mt * startPosition.top + 2 * mt * t * controlPoint.top + t * t * targetTop;
  }
}

function updateMovingDuckSprite(duck: Duck, duckElement: HTMLImageElement, startPosition: Position): void {
  const currentDirection = duck.position.left > startPosition.left ? 1 : -1;
  duckElement.src = `../assets/duck/right-left-yellow/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
  duck.frame = duck.frame === 1 ? 2 : 1;
}

function playDuckSound(): void {
  const duckSound = document.getElementById("duckSound") as HTMLAudioElement;
  if (duckSound) {
    duckSound.play().catch(() => console.log("Tự động phát bị chặn, yêu cầu thao tác từ người dùng."));
  }
}
function layEgg(duck: Duck, duckElement: HTMLImageElement): void {
    const eggCount = isBoostingNow() ? 3 : 4;
    const delayBetweenEggs = isBoostingNow() ? 500 : 1000;
  
    for (let i = 0; i < eggCount; i++) {
      setTimeout(() => {
        createEggElement(duck);
        if (i === eggCount - 1) {
          
          setTimeout(() => returnToOriginal(duck, duckElement), 1000);
        }
      }, i * delayBetweenEggs);
    }
  }
  

function createEggElement(duck: Duck): void {
  const egg = document.createElement("img");
  egg.src = "../assets/duck/egg.png";
  egg.classList.add("egg-basket");
  egg.style.position = "absolute";
  egg.style.width = "45px";
  egg.style.height = "47px";
  egg.style.zIndex = "9"; 

  // Vị trí của trứng
  if (duck.selectedBasket && duck.selectedBasket.position) {
    egg.style.left = `${duck.position.left + 1.5}%`;
    egg.style.top = `${duck.position.top + 3}%`;
  } else {
    // Vị trí mặc định nếu không có rổ
    egg.style.left = `${duck.position.left - 1.55}%`;
    egg.style.top = `${duck.position.top + 1.55}%`;
  }

  egg.style.cursor = "pointer";

  // Thêm sự kiện click vào trứng
  egg.addEventListener('click', () => {
    incrementEggAndCoin();
    document.body.removeChild(egg);
  });

  document.body.appendChild(egg);
}

function returnToOriginal(duck: Duck, duckElement: HTMLImageElement): void {
  if (!duck.originalPosition) return;

  const startPosition = { left: duck.position.left, top: duck.position.top };
  const targetPosition = duck.originalPosition;

  const startTime = Date.now();
  const duration = GAME_CONSTANTS.MOVEMENT.RETURN_DURATION;

  const returnInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    if (progress >= 1) {
      clearInterval(returnInterval);
      duck.position.left = targetPosition.left;
      duck.position.top = targetPosition.top;
      duck.moving = true;
      return;
    }

    // Di chuyển về vị trí gốc
    duck.position.left = startPosition.left + (targetPosition.left - startPosition.left) * progress;
    duck.position.top = startPosition.top + (targetPosition.top - startPosition.top) * progress;

    duckElement.style.left = `${duck.position.left}%`;
    duckElement.style.top = `${duck.position.top}%`;

    const currentDirection = duck.position.left > startPosition.left ? 1 : -1;
    duckElement.src = `../assets/duck/right-left-yellow/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
    duck.frame = duck.frame === 1 ? 2 : 1;
  }, 50);
}
