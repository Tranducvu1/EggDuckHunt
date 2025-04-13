// Import Web3 library
import Web3 from 'web3';
import { PlayerData } from '../Types/types';
import { updateDucksBasedOnCount } from '../DuckManager/duckManager';
import { moveDuck } from '../game';
import { ducks } from '../DuckManager/duckManager';
import { setupDuckMovement } from '../State/duckMovement';
// Import GSAP for animations
import { gsap } from 'gsap';

declare var window: any;
let web3: Web3;
let account: string;
let player: PlayerData;
// Flag to track if player token has been verified
let tokenVerified = false;

// 📌 Get DOM elements
const yellowDuckCountEl = document.getElementById('yellowDuckCount') as HTMLElement;
const redDuckCountEl = document.getElementById('redDuckCount') as HTMLElement;
const exchangeYellowDuckBtn = document.getElementById('exchangeYellowDuckBtn') as HTMLButtonElement;
const exchangeRedDuckBtn = document.getElementById('exchangeRedDuckBtn') as HTMLButtonElement;

const eggCountchangeEl = document.getElementById('eggCount') as HTMLElement;
const coinCountchangeEl = document.getElementById('coinCount') as HTMLElement;
const exchangeBtn = document.getElementById('exchangeBtn') as HTMLButtonElement;
const duckcountcoinEl = document.getElementById('duckcoinCount') as HTMLElement;
const exchangeduckBtn = document.getElementById('exchangeduckBtn') as HTMLButtonElement;
const duckCountEl = document.getElementById('duckCount') as HTMLElement;

// Get counter elements for animations
const eggCounterEl = document.getElementById('eggCounter')?.querySelector('span') as HTMLElement;
const coinCounterEl = document.getElementById('coinCounter')?.querySelector('span') as HTMLElement;

// 📌 Set up constants
const EGGS_PER_COIN = 10;
const COIN_PER_DUCK = 10;

// Animation function for counters
function animateCounter(element: HTMLElement | null, startValue: number, endValue: number, duration = 1): void {
    // Store the starting value
    let obj = { value: startValue };
    
    // Create the tween
    gsap.to(obj, {
        value: endValue, 
        duration: duration,
        ease: "power1.out",
        onUpdate: function() {
            // Update the element with current value
            if (element) {
                element.textContent = Math.floor(obj.value).toString();
            }
        },
        onComplete: function() {
            // Ensure the final value is exact
            if (element) {
                element.textContent = endValue.toString();
            }
        }
    });
    
    // Add a pop effect to the counter
    if (element && startValue < endValue) {
        gsap.fromTo(element.parentElement, 
            { scale: 1 },
            { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
        );
    }
}

// Get wallet balance
const getBalance = async (address: string) => {
    const weiBalance = await web3.eth.getBalance(address);
    const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
    const balance = parseFloat(ethBalance).toFixed(4);
    const balanceElement = document.getElementById('balance') as HTMLElement;
    if (balanceElement) {
        balanceElement.textContent = balance;
    }
    
    // Store balance in sessionStorage for use in the game page
    sessionStorage.setItem('userBalance', balance);
    sessionStorage.setItem('userAddress', address);
};

function updateDisplay(): void {
    const eggCount = parseInt(localStorage.getItem('eggCount') || '0', 10);
    const coinCount = parseInt(localStorage.getItem('coinCount') || '0', 10);
    const duckCount = parseInt(localStorage.getItem('duckCount') || '0', 10);
    
    // Get previous values for animation
    const prevEggCount = parseInt(eggCountchangeEl.textContent || '0', 10);
    const prevCoinCount = parseInt(coinCountchangeEl.textContent || '0', 10);
    const prevDuckCount = parseInt(duckCountEl.textContent || '0', 10);

    // Update UI elements with animation if values changed
    if (prevEggCount !== eggCount) {
        animateCounter(eggCountchangeEl, prevEggCount, eggCount);
        // Also update the top counter if it exists
        if (eggCounterEl) {
            animateCounter(eggCounterEl, prevEggCount, eggCount);
        }
    } else {
        eggCountchangeEl.textContent = eggCount.toString();
        if (eggCounterEl) {
            eggCounterEl.textContent = eggCount.toString();
        }
    }
    
    if (prevCoinCount !== coinCount) {
        animateCounter(coinCountchangeEl, prevCoinCount, coinCount);
        animateCounter(duckcountcoinEl, prevCoinCount, coinCount);
        // Also update the top counter if it exists
        if (coinCounterEl) {
            animateCounter(coinCounterEl, prevCoinCount, coinCount);
        }
    } else {
        coinCountchangeEl.textContent = coinCount.toString();
        duckcountcoinEl.textContent = coinCount.toString();
        if (coinCounterEl) {
            coinCounterEl.textContent = coinCount.toString();
        }
    }
    
    if (prevDuckCount !== duckCount) {
        animateCounter(duckCountEl, prevDuckCount, duckCount);
    } else {
        duckCountEl.textContent = duckCount.toString();
    }
    
    exchangeduckBtn.disabled = coinCount < COIN_PER_DUCK;
    exchangeBtn.disabled = eggCount < EGGS_PER_COIN;
    console.log("Số trứng còn lại sau khi quy đổi:", eggCount);
    console.log("Số coin còn lại sau khi quy đổi:", coinCount);
    console.log("Số duck còn lại sau khi quy đổi:", duckCount);
    
    // Gọi updatePlayer nếu đã có player và token đã được xác thực
    if (player && player.id && tokenVerified) {
        console.log("Cập nhật thông tin người chơi trên server:", player.id, eggCount, coinCount, duckCount);
        // Cập nhật thông tin người chơi trên server (gọi API để cập nhật thông tin người chơi)
        updatePlayer(player.id, eggCount, coinCount, duckCount);
    }
}

// Add a visual feedback function for exchange buttons
function animateExchangeEffect(resourceType: string) {
    // Create flying particles effect
    const container = document.querySelector('.exchange-container');
    if (!container) return;
    
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
        // Create a particle
        const particle = document.createElement('div');
        particle.className = `particle ${resourceType}-particle`;
        container.appendChild(particle);
        
        // Position the particle randomly around the button
        const randomX = Math.random() * 100 - 50;
        const randomY = Math.random() * 100 - 50;
        
        // Animate with GSAP
        gsap.fromTo(particle, 
            { 
                x: 0, 
                y: 0, 
                opacity: 1, 
                scale: 0.5 
            },
            { 
                x: randomX, 
                y: randomY, 
                opacity: 0, 
                scale: 1, 
                duration: 1.5, 
                ease: "power2.out",
                onComplete: () => {
                    particle.remove(); // Clean up
                }
            }
        );
    }
}

exchangeBtn.addEventListener('click', () => {
    let eggCount = parseInt(localStorage.getItem('eggCount') || '0', 10);
    let coinCount = parseInt(localStorage.getItem('coinCount') || '0', 10);
    let duckCount = parseInt(localStorage.getItem('duckCount') || '0', 10);
    
    if (eggCount >= EGGS_PER_COIN) {
        const coinsToAdd = Math.floor(eggCount / EGGS_PER_COIN);
        coinCount += coinsToAdd;
        eggCount %= EGGS_PER_COIN;
        console.log("Số trứng còn lại sau khi quy đổi:", eggCount);
        // Cập nhật lại localStorage
        localStorage.setItem('eggCount', eggCount.toString());
        localStorage.setItem('coinCount', coinCount.toString());
        
        // Add animation effect
        animateExchangeEffect('coin');
        
        if (!tokenVerified) {
            // Kết nối và xác thực token nếu chưa xác thực
            connectMetaMask();
        } else {
            // Nếu đã xác thực token, chỉ cần cập nhật giao diện và gọi updatePlayer
            updateDisplay();
        }
        
        // Cập nhật thông tin trên server (gọi API để cập nhật thông tin người chơi)
        if (player && player.id && tokenVerified) {
            console.log("Cập nhật thông tin người chơi trên server:", player.id, eggCount, coinCount, duckCount);
            updatePlayer(player.id, eggCount, coinCount, duckCount);
        } else if (!tokenVerified) {
            console.log("Token chưa được xác thực, đang kết nối...");
        } else {
            console.error("Không có thông tin player.id, không thể cập nhật");
        }
    }
});

exchangeduckBtn.addEventListener('click', () => {
    let eggCount = parseInt(localStorage.getItem('eggCount') || '0', 10);
    let coinCount = parseInt(localStorage.getItem('coinCount') || '0', 10);
    let duckCount = parseInt(localStorage.getItem('duckCount') || '0', 10);
    
    if (coinCount >= COIN_PER_DUCK) {
        coinCount -= COIN_PER_DUCK;
        duckCount += 1;
        
        localStorage.setItem('coinCount', coinCount.toString());
        localStorage.setItem('duckCount', duckCount.toString());
        
        // Add animation effect
        animateExchangeEffect('duck');

        if (player && player.id && tokenVerified) {
            updatePlayer(player.id, eggCount, coinCount, duckCount);
        } else if (!tokenVerified) {
            connectMetaMask(); // Kết nối nếu chưa kết nối
        }
        updateDisplay();
        updateDucksBasedOnCount(); // Cập nhật số lượng vịt trong game
        setupDuckMovement();
    }
});

// Khởi tạo Web3 chỉ khi có Ethereum
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
}

// Lưu token vào localStorage để sử dụng giữa các phiên
const saveVerifiedToken = (token: string) => {
    localStorage.setItem('verifiedToken', token);
};

// Lấy token đã xác thực từ localStorage
const getVerifiedToken = (): string | null => {
    return localStorage.getItem('verifiedToken');
};

const connectMetaMask = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];

            console.log("🔐 Địa chỉ MetaMask:", account);
            getBalance(account);

            // Kiểm tra xem token đã được xác thực chưa
            const savedToken = getVerifiedToken();
            if (savedToken && savedToken === account) {
                console.log("🔄 Sử dụng token đã xác thực trước đó");
                tokenVerified = true;
                
                // Lấy thông tin người chơi từ localStorage nếu có
                if (!player || !player.id) {
                    await getPlayer(); // Gọi getPlayer một lần để lấy ID nếu chưa có
                } else {
                    updateDisplay(); // Nếu đã có thông tin player, chỉ cần cập nhật giao diện
                }
            } else {
                // Nếu token chưa được xác thực hoặc khác với token đã lưu, gọi getPlayer để xác thực
                const playerExists = await getPlayer();
                if (playerExists) {
                    tokenVerified = true;
                    saveVerifiedToken(account); // Lưu token đã xác thực
                }
            }

            console.log("🔐 Kết nối thành công");
        } catch (error) {
            console.error("Lỗi khi kết nối MetaMask:", error);
            alert("Đã xảy ra lỗi khi kết nối MetaMask. Vui lòng thử lại.");
        }
    } else {
        alert('Vui lòng cài đặt MetaMask để sử dụng ứng dụng này.');
    }
};

const updatePlayer = async (id: number, eggCount: number, coinCount: number, duckCount: number) => {
    try {
        const response = await fetch(`http://localhost:7272/api/v1/player/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                egg: eggCount,
                coins: coinCount,
                whiteDuck: duckCount,
            }),
        });

        if (response.ok) {
            console.log("Cập nhật thêm thành công!");
        } else {
            console.error("Lỗi cập nhật người chơi");
            // Nếu cập nhật thất bại, có thể token không còn hợp lệ
            tokenVerified = false;
            localStorage.removeItem('verifiedToken');
        }
    } catch (err) {
        console.error("Lỗi khi gửi yêu cầu:", err);
        // Nếu có lỗi kết nối, đánh dấu token là chưa xác thực để thử lại lần sau
        tokenVerified = false;
        localStorage.removeItem('verifiedToken');
    }
};

const getPlayer = async (): Promise<boolean> => {
    try {
        const response = await fetch('http://localhost:7272/api/v1/player'); 
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin người chơi');
        }

        const data: PlayerData[] = await response.json();

        console.log("🎮 Token từ MetaMask:", account);

        // Lặp qua từng player để in ra token
        data.forEach((player: PlayerData) => {
            console.log("🧑 Token từ API:", player.token);
        });

        const playerData = data.find((player: PlayerData) => player.token === account);
        if (playerData) {
            player = playerData; // Gán toàn bộ dữ liệu player bao gồm id vào biến player toàn cục
            console.log("✅ Người chơi có tồn tại trong hệ thống:", playerData);
            console.log("✅ ID người chơi:", player.id); // Log ID để xác nhận
            
            // Cập nhật localStorage với thông tin người chơi từ API
            localStorage.setItem('eggCount', playerData.egg.toString());
            localStorage.setItem('coinCount', playerData.coins.toString());
            localStorage.setItem('duckCount', playerData.whiteDuck.toString());
            
            // Cập nhật lại giao diện
            updateDisplay();
            return true;
        }

        console.log("❌ Người chơi không tồn tại trong hệ thống.");
        return false;
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin người chơi:", error);
        alert("Đã xảy ra lỗi khi lấy thông tin người chơi. Vui lòng thử lại.");
        return false;
    }
};

// Kiểm tra token đã lưu khi trang được tải
const initializeWithSavedToken = async () => {
    const savedToken = getVerifiedToken();
    if (savedToken && window.ethereum) {
        try {
            // Kết nối MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            
            // Kiểm tra xem token hiện tại có khớp với token đã lưu không
            if (account === savedToken) {
                console.log("🔄 Khôi phục phiên với token đã xác thực");
                tokenVerified = true;
                await getPlayer(); // Lấy thông tin người chơi một lần
            } else {
                console.log("⚠️ Token đã thay đổi, cần xác thực lại");
                localStorage.removeItem('verifiedToken');
            }
        } catch (error) {
            console.error("Lỗi khi khởi tạo với token đã lưu:", error);
        }
    }
};

export function autoUpdate() {
    setInterval(() => {
        updateDisplay();
    }, 1000);
}

// Khởi tạo màn hình và bắt đầu cập nhật tự động
updateDisplay();
// Khởi tạo với token đã lưu (nếu có)
initializeWithSavedToken();
// autoUpdate();

// Export hàm connectMetaMask nếu cần sử dụng ở nơi khác
export { connectMetaMask, updateDisplay };