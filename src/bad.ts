
document.addEventListener("DOMContentLoaded", () => {
    const bagIcon = document.querySelector(".icon-bag") as HTMLDivElement;
    const bagPopup = document.getElementById("bagPopup") as HTMLDivElement;

    if (bagIcon && bagPopup) {
        bagIcon.addEventListener("click", () => {
            bagPopup.style.display = bagPopup.style.display === "none" || bagPopup.style.display === "" ? "block" : "none";
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const ducks = document.querySelectorAll(".duck");

    ducks.forEach((duck) => {
        duck.addEventListener("click", (event) => {
            const duckId = (event.target as HTMLElement).id; // Lấy ID của con vịt
            const duckName = `Vịt ${duckId.replace("duck", "")}`;
            const nextEggTime = getNextEggTime(duckId);

            showDuckInfo(event, duckName, nextEggTime);
        });
    });
});

function getNextEggTime(duckId: string): string {
    // Giả lập thời gian đẻ trứng ngẫu nhiên từ 5 đến 15 giây
    const timeLeft = Math.floor(Math.random() * 10) + 5;
    return `${timeLeft} giây`;
}

function showDuckInfo(event: Event, name: string, time: string) {
    let infoBox = document.getElementById("duckInfo");

    if (!infoBox) {
        infoBox = document.createElement("div");
        infoBox.id = "duckInfo";
        infoBox.style.position = "absolute";
        infoBox.style.padding = "10px";
        infoBox.style.background = "rgba(0, 0, 0, 0.7)";
        infoBox.style.color = "#fff";
        infoBox.style.borderRadius = "5px";
        infoBox.style.fontSize = "16px";
        infoBox.style.pointerEvents = "none";
        document.body.appendChild(infoBox);
    }

    const mouseEvent = event as MouseEvent;
    infoBox.style.top = `${mouseEvent.clientY + 10}px`;
    infoBox.style.left = `${mouseEvent.clientX + 10}px`;

    infoBox.innerHTML = `<div>${name}</div><div>Đẻ trứng sau: ${time}</div>`;

    setTimeout(() => {
        infoBox?.remove();
    }, 3000);
}


