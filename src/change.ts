// Lấy các phần tử DOM
const eggCountchangeEl = document.getElementById('eggCount') as HTMLElement;
const coinCountchangeEl = document.getElementById('coinCount') as HTMLElement;
const decreaseEggBtn = document.getElementById('decreaseEgg') as HTMLButtonElement;
const increaseEggBtn = document.getElementById('increaseEgg') as HTMLButtonElement;
const exchangeBtn = document.getElementById('exchangeBtn') as HTMLButtonElement;

// Hằng số
const EGGS_PER_COIN: number = 10;

// Cập nhật giao diện
function updateDisplay(): void {
    eggCountchangeEl.textContent = localStorage.getItem('eggCount') || '0';
    coinCountchangeEl.textContent = localStorage.getItem('coinCount') || '0';

    const eggCountchange = parseInt(eggCountchangeEl.textContent || '0');
    exchangeBtn.disabled = eggCountchange < EGGS_PER_COIN;
    decreaseEggBtn.disabled = eggCountchange <= 0;
}

// Tăng số lượng trứng
increaseEggBtn.addEventListener('click', () => {
    let eggCountchange = parseInt(localStorage.getItem('eggCount') || '0');
    if (eggCountchange < 1000) {
        eggCountchange++;
        localStorage.setItem('eggCount', eggCountchange.toString());
        updateDisplay();
    }
});

// Giảm số lượng trứng
decreaseEggBtn.addEventListener('click', () => {
    let eggCountchange = parseInt(localStorage.getItem('eggCount') || '0');
    if (eggCountchange > 0) {
        eggCountchange--;
        localStorage.setItem('eggCount', eggCountchange.toString());
        updateDisplay();
    }
});

// Đổi trứng lấy xu
exchangeBtn.addEventListener('click', () => {
    let eggCountchange = parseInt(localStorage.getItem('eggCount') || '0');
    let coinCountchange = parseInt(localStorage.getItem('coinCount') || '0');

    if (eggCountchange >= EGGS_PER_COIN) {
        const coinsToAdd: number = Math.floor(eggCountchange / EGGS_PER_COIN);
        coinCountchange += coinsToAdd;
        eggCountchange %= EGGS_PER_COIN;

        localStorage.setItem('eggCount', eggCountchange.toString());
        localStorage.setItem('coinCount', coinCountchange.toString());
        updateDisplay();
    }
});

// Cập nhật giao diện liên tục
function autoUpdate() {
    setInterval(() => {
        updateDisplay(); // Luôn lấy giá trị mới từ localStorage
    }, 1000); // Cập nhật mỗi giây
}

// Gọi hàm tự động cập nhật khi trang load
updateDisplay();
autoUpdate();
