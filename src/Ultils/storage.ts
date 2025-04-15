import { updateDisplay } from "../UI/change";

let eggCount: number = 0;
let coinCount: number = 0;

export function initializeGameStorage(): void {
    if (localStorage.getItem('eggCount') === null) {
        localStorage.setItem('eggCount', '0');
    }
    if (localStorage.getItem('coinCount') === null) {
        localStorage.setItem('coinCount', '0');
    }
    loadCountersFromStorage();
    setInterval(loadCountersFromStorage, 1000);
    updateCounters();
}

function loadCountersFromStorage(): void {
    eggCount = parseInt(localStorage.getItem('eggCount') || '0');
    coinCount = parseInt(localStorage.getItem('coinCount') || '0');
    updateCounters();
}

export function incrementEggAndCoin(): void {
    eggCount++;
    localStorage.setItem('eggCount', eggCount.toString());
    updateDisplay();
    updateCounters();
    console.log("Egg incremented, new count:", eggCount);
}

export function updateCounters(): void {
    const eggCountElement = document.querySelector("#eggCounter span") as HTMLElement;
    const coinCountElement = document.querySelector("#coinCounter span") as HTMLElement;

    eggCountElement.innerText = eggCount.toString();
    coinCountElement.innerText = coinCount.toString();
}

export { eggCount, coinCount};
