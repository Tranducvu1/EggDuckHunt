// List of tutorial steps
const tutorialSteps: TutorialStep[] = [
    {
        message: "Chào mừng bạn đến với Duck Egg Hunt! Hãy khám phá trò chơi qua hướng dẫn này.",
        targetElement: "body",
        position: "top"
    },
    {
        message: "Đây là khu vực hiển thị số lượng trứng và xu bạn đã thu thập được.",
        targetElement: ".counter-container",
        position: "bottom"
    },
    {
        message: "Nhấp vào túi để mở cửa hàng. Tại đây bạn có thể đổi trứng lấy xu và mua vịt.",
        targetElement: ".icon-bag",
        position: "right"
    },
    {
        message: "Nhấp vào biểu tượng này để xem thông tin hợp đồng và thực hiện giao dịch.",
        targetElement: ".icon-contract",
        position: "right"
    },
    {
        message: "Xem danh sách nhiệm vụ hàng ngày ở đây để nhận thưởng.",
        targetElement: ".icon-task",
        position: "left"
    },
    {
        message: "Điều chỉnh âm lượng game tại đây.",
        targetElement: ".settings-btn",
        position: "left"
    },
    {
        message: "Thông tin tài khoản của bạn. Nhấp vào để xem chi tiết.",
        targetElement: ".user-profile",
        position: "left"
    },
    {
        message: "Bạn đã sẵn sàng! Giờ bạn có thể bắt đầu chơi và thu thập trứng. Chúc vui vẻ!",
        targetElement: "body",
        position: "top"
    }
];

// Tutorial management class
class TutorialManager {
    private currentStep = 0;
    private overlay: HTMLElement;
    private message: HTMLElement;
    private nextButton: HTMLElement;
    private startButton: HTMLElement;
    private isActive = false;
    private highlightElement: HTMLElement | null = null;

    constructor() {
        // Get DOM elements for tutorial UI
        this.overlay = document.getElementById('tutorialOverlay') as HTMLElement;
        this.message = document.getElementById('tutorialMessage') as HTMLElement;
        this.nextButton = document.getElementById('nextTutorialBtn') as HTMLElement;
        this.startButton = document.getElementById('startTutorialBtn') as HTMLElement;

        this.initEventListeners();
    }

    private initEventListeners(): void {
        // Start tutorial button
        this.startButton.addEventListener('click', () => this.startTutorial());
        
        // Next step button
        this.nextButton.addEventListener('click', () => this.nextStep());

        // Optional: Click the overlay to proceed
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.nextStep();
            }
        });
    }

    // Start the tutorial
    public startTutorial(): void {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        this.showStep();
    }

    // Move to the next step
    private nextStep(): void {
        this.currentStep++;
        
        if (this.currentStep < tutorialSteps.length) {
            this.showStep();
        } else {
            this.endTutorial();
        }
    }

    // Show the current step's tutorial message
    private showStep(): void {
        const step = tutorialSteps[this.currentStep];
        this.message.textContent = step.message;
        
        // Show overlay
        this.overlay.style.display = 'flex';
        
        // Highlight the target element
        this.highlightElement = this.createHighlight(step.targetElement);
        
        // Position the message relative to the target element
        this.positionMessage(this.highlightElement, step.position || 'bottom');
    }

    // Create a highlight effect for the target element
    private createHighlight(selector: string): HTMLElement {
        // Remove old highlight if any
        if (this.highlightElement) {
            document.body.removeChild(this.highlightElement);
        }

        // Find the target element
        const targetElement = selector === 'body' 
            ? document.body 
            : document.querySelector(selector) as HTMLElement;
        
        if (!targetElement) {
            throw new Error(`Target element not found for selector: ${selector}`);
        }

        // Get the element's position and size
        const rect = targetElement.getBoundingClientRect();
        
        // Create the highlight element
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        highlight.style.position = 'absolute';
        highlight.style.left = `${rect.left + window.scrollX}px`;
        highlight.style.top = `${rect.top + window.scrollY}px`;
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
        highlight.style.border = '3px solid #FFD700';
        highlight.style.borderRadius = '5px';
        highlight.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.5)';
        highlight.style.zIndex = '9998';
        highlight.style.pointerEvents = 'none';
        
        document.body.appendChild(highlight);
        
        return highlight;
    }

    // Position the tutorial message relative to the target element
    private positionMessage(targetElement: HTMLElement, position: string): void {
        if (!targetElement) return;
        
        const rect = targetElement.getBoundingClientRect();
        const messageRect = this.message.getBoundingClientRect();
        
        // Calculate the position of the message based on the selected position
        let top, left;
        
        switch (position) {
            case 'top':
                top = rect.top - messageRect.height - 20;
                left = rect.left + (rect.width - messageRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 20;
                left = rect.left + (rect.width - messageRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - messageRect.height) / 2;
                left = rect.left - messageRect.width - 20;
                break;
            case 'right':
                top = rect.top + (rect.height - messageRect.height) / 2;
                left = rect.right + 20;
                break;
            default:
                top = rect.bottom + 20;
                left = rect.left + (rect.width - messageRect.width) / 2;
        }
        
        // Ensure the message stays within the viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (left < 10) left = 10;
        if (left + messageRect.width > viewportWidth - 10) left = viewportWidth - messageRect.width - 10;
        if (top < 10) top = 10;
        if (top + messageRect.height > viewportHeight - 10) top = viewportHeight - messageRect.height - 10;
        
        // Update the message position
        this.message.style.position = 'absolute';
        this.message.style.top = `${top}px`;
        this.message.style.left = `${left}px`;
    }

    // End the tutorial
    private endTutorial(): void {
        this.isActive = false;
        
        // Hide the overlay
        this.overlay.style.display = 'none';
        
        // Remove the highlight
        if (this.highlightElement) {
            document.body.removeChild(this.highlightElement);
            this.highlightElement = null;
        }
        
        // Save the tutorial completion state
        localStorage.setItem('tutorialCompleted', 'true');
    }

    // Check if the user has completed the tutorial
    public checkTutorialStatus(): void {
        const completed = localStorage.getItem('tutorialCompleted') === 'true';
        
        // If this is the user's first visit, start the tutorial automatically
        if (!completed && !this.isActive) {
            setTimeout(() => this.startTutorial(), 1000);
        }
    }
}

// Initialize and export the tutorial manager object
const tutorialManager = new TutorialManager();

// Check tutorial status when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    tutorialManager.checkTutorialStatus();
});

export default tutorialManager;
