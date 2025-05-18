// js/clear-button.js
import { clearButton } from './elements.js';

export function setupClearButton() {
    // The clear button will not have any specific action now
    clearButton.addEventListener('click', () => {
        // You can add functionality for the clear button here if needed in the future
        console.log('Clear button clicked');
    });
}