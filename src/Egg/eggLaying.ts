// game.ts
import { toast } from "react-toastify";
 // @ts-ignore
 import { handlecollectEgg } from '../components/ContractActions.js';
import { baskets } from '../Basket/baskets';
import { GAME_CONSTANTS } from '../Constant/constant';
import { Duck } from "../Types/Duck.js";
import { Position } from "../Types/Position.js";
import { DuckType } from "../Types/DuckType.js";
import { addXP } from "../Experient/Experient.js";
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
// Updated functions for duck sprite paths based on duck type

// Get the correct path prefix based on duck type
function getDuckPathPrefix(duck: Duck): string {
  switch (duck.type) {
    case DuckType.WHITE:
      return "../assets/duck/right-left";
    case DuckType.RED:
      return "../assets/duck/right-left-red";
    case DuckType.YELLOW:
      return "../assets/duck/right-left-yellow";
    default:
      return "../assets/duck/right-left";
  }
}

// Get the correct flying path prefix based on duck type
function getDuckFlyingPathPrefix(duck: Duck): string {
  switch (duck.type) {
    case DuckType.WHITE:
      return "../assets/duck/fly";
    case DuckType.RED:
      return "../assets/duck/fly-red";
    case DuckType.YELLOW:
      return "../assets/duck/fly-yellow";
    default:
      return "../assets/duck/fly";
  }
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
  // Use the correct path based on duck type
  const duckPathPrefix = getDuckPathPrefix(duck);
  duckElement.src = `${duckPathPrefix}/a${initialDirection > 0 ? 1 : 3}.png`;

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

    // Cập nhật sprite của vịt với màu sắc tương ứng
    updateMovingDuckSprite(duck, duckElement, startPosition);

  }, 100);
}

function updateMovingDuckSprite(duck: Duck, duckElement: HTMLImageElement, startPosition: Position): void {
  const currentDirection = duck.position.left > startPosition.left ? 1 : -1;
  // Use the correct path based on duck type
  const duckPathPrefix = getDuckPathPrefix(duck);
  duckElement.src = `${duckPathPrefix}/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
  duck.frame = duck.frame === 1 ? 2 : 1;
}

function returnToOriginal(duck: Duck, duckElement: HTMLImageElement): void {
  if (!duck.originalPosition) return;

  const startPosition = { left: duck.position.left, top: duck.position.top };
  const targetPosition = duck.originalPosition;

  const startTime = performance.now();
  const duration = GAME_CONSTANTS.MOVEMENT.RETURN_DURATION;
  let lastFrameChange = 0;

  function animate(time: number) {
    const elapsed = time - startTime;
    let progress = Math.min(elapsed / duration, 1);

    // Ease-in movement 
    progress = progress * progress;

    // Cập nhật vị trí
    duck.position.left = startPosition.left + (targetPosition.left - startPosition.left) * progress;
    duck.position.top = startPosition.top + (targetPosition.top - startPosition.top) * progress;

    duckElement.style.left = `${duck.position.left}%`;
    duckElement.style.top = `${duck.position.top}%`;

    // Đổi frame mỗi 200ms
    if (time - lastFrameChange > 200) {
      duck.frame = duck.frame === 1 ? 2 : 1;
      lastFrameChange = time;
    }

    // Cập nhật sprite theo hướng và màu sắc của vịt
    const currentDirection = targetPosition.left > startPosition.left ? 1 : -1;
    const duckFlyingPathPrefix = getDuckFlyingPathPrefix(duck);
    duckElement.src = `${duckFlyingPathPrefix}/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;

    // Kết thúc nếu đã đến nơi
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      duck.moving = true;
    }
  }

  requestAnimationFrame(animate);
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


function playDuckSound(): void {
  const duckSound = document.getElementById("duckSound") as HTMLAudioElement;
  if (duckSound) {
    duckSound.play().catch(() => console.log("Tự động phát bị chặn, yêu cầu thao tác từ người dùng."));
  }
}

function layEgg(duck: Duck, duckElement: HTMLImageElement): void {
  let baseEggCount = duck.level;

  // Xác định số trứng theo loại vịt
  switch (duck.type) {
    case DuckType.YELLOW:
      baseEggCount += 1;
      break;
    case DuckType.RED:
      baseEggCount += 2;
      break;
    default:
      baseEggCount = 1;
      break;
  }

  const eggCount = isBoostingNow() ? baseEggCount + 1 : baseEggCount; 
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

  egg.addEventListener('click', async () => {
    try {
      // Bắt đầu animation
      egg.classList.add("egg-collect-animation");
  
      // Chờ animation hoàn tất (600ms)
      await new Promise((resolve) => setTimeout(resolve, 600));
  
      await handlecollectEgg();       // Gọi smart contract
      
  
      // theem 1 điểm kinh nghiệm
      addXP(1);
      // sau khi click xóa trứng khỏi dom
      document.body.removeChild(egg);
    } catch (error) {
      console.error("Error collecting egg:", error);
      toast.error("Something went wrong while collecting the egg!");
    }
  });
  

  document.body.appendChild(egg);
}
export function setupUFO(): void {
  const ufo = document.getElementById('ufoIcon')!;
  if (!ufo) {
    console.error("UFO Icon not found!");
    return;
  }

  let isCollecting = false; // Biến để kiểm tra trạng thái đang thu thập hay không
  let collectionInterval: number | null = null;
  
  // Sử dụng localStorage để lưu trữ thời gian lần cuối sử dụng UFO
  const lastUseTimeKey = 'lastUFOUseTime';
  const cooldownMinutes = 5; // Thời gian chờ 5 phút
  
  // Kiểm tra xem UFO có sẵn sàng để sử dụng không
  function isUFOReady(): boolean {
    const lastUseTime = localStorage.getItem(lastUseTimeKey);
    if (!lastUseTime) return true;
    // kiểm tra thời gian chờ sau khi sử dụng
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const currentTime = new Date().getTime();
    const timeSinceLastUse = currentTime - parseInt(lastUseTime);
    
    return timeSinceLastUse >= cooldownMs;
  }
  
  // Lấy thời gian chờ còn lại (tính bằng giây)
  function getRemainingCooldown(): number {
    const lastUseTime = localStorage.getItem(lastUseTimeKey);
    if (!lastUseTime) return 0;
    
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const currentTime = new Date().getTime();
    const timeSinceLastUse = currentTime - parseInt(lastUseTime);
    
    if (timeSinceLastUse >= cooldownMs) return 0;
    
    return Math.ceil((cooldownMs - timeSinceLastUse) / 1000);
  }
  
  // Cập nhật trạng thái và giao diện của UFO
  function updateUFOState(): void {
    if (!isUFOReady()) {
      // UFO đang trong thời gian chờ
      ufo.classList.add('ufo-cooldown'); // Thêm class để hiển thị trạng thái không khả dụng
      
      // Cập nhật tooltip hoặc hiển thị thời gian chờ
      const remainingSeconds = getRemainingCooldown();
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      
      // Tạo hoặc cập nhật tooltip (  thời gian chờ của đĩa bay sẽ tạo hình ảnh đếm ngược lần sử dụng tiếp theo)
      let cooldownTooltip = document.getElementById('ufoCooldownTooltip');
      if (!cooldownTooltip) {
        cooldownTooltip = document.createElement('div');
        cooldownTooltip.id = 'ufoCooldownTooltip';
        cooldownTooltip.style.position = 'absolute';
        cooldownTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        cooldownTooltip.style.color = 'white';
        cooldownTooltip.style.padding = '5px';
        cooldownTooltip.style.borderRadius = '5px';
        cooldownTooltip.style.fontSize = '12px';
        cooldownTooltip.style.zIndex = '1000';
        cooldownTooltip.style.pointerEvents = 'none'; // Không chặn các sự kiện chuột
        
        const ufoRect = ufo.getBoundingClientRect();
        const parentRect = ufo.offsetParent ? (ufo.offsetParent as HTMLElement).getBoundingClientRect() : document.body.getBoundingClientRect();
        
        cooldownTooltip.style.top = `${ufoRect.bottom - parentRect.top + 5}px`;
        cooldownTooltip.style.left = `${ufoRect.left - parentRect.left}px`;
        
        ufo.parentElement?.appendChild(cooldownTooltip);
      }
      
      cooldownTooltip.textContent = `Chờ: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    } else {
      // UFO sẵn sàng sử dụng
      ufo.classList.remove('ufo-cooldown');
      
      // Xóa tooltip nếu có
      const cooldownTooltip = document.getElementById('ufoCooldownTooltip');
      if (cooldownTooltip) {
        cooldownTooltip.remove();
      }
    }
  }
  
  // Cập nhật trạng thái UFO ban đầu
  updateUFOState();
  
  // Cập nhật trạng thái UFO mỗi giây
  setInterval(updateUFOState, 1000);

  ufo.addEventListener('click', () => {
    console.log("UFO clicked!");
    
    // Kiểm tra thời gian chờ
    if (!isUFOReady()) {
      const remainingSeconds = getRemainingCooldown();
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      alert(`UFO đang hồi: ${minutes} phút ${seconds} giây!`);
      return;
    }
    
    // Nếu đang trong quá trình thu thập, không làm gì cả
    if (isCollecting) {
      alert("UFO đang hoạt động!");
      return;
    }
    
    const eggCountElem = document.getElementById('tokenBalance1');
    if (!eggCountElem) {
      console.error("Egg counter element not found!");
      return;
    }

    const eggCount = parseInt(eggCountElem.innerText);
    console.log("Current egg count:", eggCount);
    // kiểm tra só lượng trứng nếu là người chơi đầu mới vào sẽ không được dùng
    if (eggCount < 5) {
      alert("Bạn cần ít nhất 5 trứng để kích hoạt UFO!");
      return;
    }

    // Trừ 5 trứng
    eggCountElem.innerText = (eggCount - 5).toString();
    
    // Lưu thời gian sử dụng hiện tại
    localStorage.setItem(lastUseTimeKey, new Date().getTime().toString());
    
    // Cập nhật trạng thái UFO ngay lập tức
    updateUFOState();

    // Tạo hiệu ứng UFO bay lơ lửng
    const ufoRect = ufo.getBoundingClientRect();
    const flyingUfo = ufo.cloneNode(true) as HTMLElement;
    flyingUfo.id = "flyingUfo";
    flyingUfo.style.position = 'fixed';
    flyingUfo.style.left = `${ufoRect.left}px`;
    flyingUfo.style.top = `${ufoRect.top}px`;
    flyingUfo.style.transform = 'scale(0.1)';
    flyingUfo.style.zIndex = '999';
    flyingUfo.style.filter = 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.7))'; // Thêm hiệu ứng ánh sáng xanh
    document.body.appendChild(flyingUfo);
    flyingUfo.style.animation = 'flyUpDown 2s ease-in-out infinite';
  
    // Tạo văn bản thông báo
    const statusText = document.createElement('div');
    statusText.id = 'ufoStatus';
    statusText.style.position = 'fixed';
    statusText.style.left = `${ufoRect.left - 20}px`;
    statusText.style.top = `${ufoRect.top}px`;
    statusText.style.color = '#fff';
    statusText.style.fontWeight = 'bold';
    statusText.style.textShadow = '0 0 5px #000';
    statusText.style.zIndex = '1000';
    statusText.innerText = 'Đang thu hoạch: 20s';
    document.body.appendChild(statusText);

    // Đặt trạng thái đang thu thập
    isCollecting = true;
    
    // Bắt đầu đếm ngược
    let remainingTime = 20;
    let countdownInterval = setInterval(() => {
      remainingTime--;
      if (statusText) {
        statusText.innerText = `Đang thu hoạch: ${remainingTime}s`;
      }
      
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Chức năng tự động nhặt trứng
    const collectEggs = () => {
      const eggs = document.querySelectorAll('.egg-basket');
      console.log(`Found ${eggs.length} eggs to collect`);
      
      if (eggs.length > 0) {
        // Lấy một trứng ngẫu nhiên
        const randomIndex = Math.floor(Math.random() * eggs.length);
        const egg = eggs[randomIndex] as HTMLElement;
        const eggRect = egg.getBoundingClientRect();
        
      

        setTimeout(() => {
          // tao hiệu ứng
          const beam = document.createElement('div');
          beam.style.position = 'fixed';
          beam.style.left = `${eggRect.left + eggRect.width / 2 - 10}px`;
          beam.style.top = `${eggRect.top +100}px`; 
          beam.style.width = '20px'; 
          beam.style.height = '30px';
          beam.style.background = 'radial-gradient(ellipse at center, rgba(0,255,0,0.6) 0%, rgba(0,255,0,0) 80%)';
          beam.style.zIndex = '998';
          beam.style.pointerEvents = 'none';
          document.body.appendChild(beam);
          
          // Hiệu ứng trứng biến mất
          egg.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s';
          egg.style.transform = 'translateY(-30px) scale(0.5)';
          egg.style.opacity = '0';
          
          // Gọi sự kiện click để kích hoạt logic thu thập trứng
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          egg.dispatchEvent(clickEvent);
          
          // Xóa hiệu ứng beam sau 0.5 giây
          setTimeout(() => {
            beam.remove();
          }, 500);
        }, 500);
      }
    };
    
    // Bắt đầu tự động thu thập mỗi 1 giây
    collectionInterval = setInterval(collectEggs, 1000) as unknown as number;
    
    // Dừng thu thập sau 20 giây
    setTimeout(() => {
      if (collectionInterval) {
        clearInterval(collectionInterval);
      }
      isCollecting = false;
      
      // Xóa UFO và thông báo
      flyingUfo.style.transition = 'all 1s ease-in-out';
      flyingUfo.style.transform = 'translateY(-100px)';
      flyingUfo.style.transform = 'scale(0.1)';
      flyingUfo.style.opacity = '0';
      
      if (statusText) {
        statusText.innerText = 'Hoàn thành!';
        setTimeout(() => {
          statusText.remove();
        }, 2000);
      }
      
      setTimeout(() => {
        flyingUfo.remove();
      }, 1000);
      
    }, 50000);
  });
  
  // CSS cho trạng thái cooldown của UFO
  const style = document.createElement('style');
  style.textContent = `
    
  .ufo-cooldown {
      filter: grayscale(100%) brightness(50%);
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
}