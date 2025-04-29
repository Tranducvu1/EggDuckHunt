
// Interface define s a tutorial step for the game
//  * @interface TutorialStep
interface TutorialStep {
    message: string;          // Guide message to be displayed
    targetElement: string;    // ID or class of the element to be highlighted
    position?: 'top' | 'bottom' | 'left' | 'right'; // Position of the message relative to the target element
    highlight?: boolean;     // Whether to highlight the target element
}