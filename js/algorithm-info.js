// js/algorithm-info.js
import { menuIcon, algorithmMenuOverlay, algorithmMenuItems, algorithmInfoPopup, popupAlgorithmName, popupAlgorithmDescription, closePopup, clearButton } from './elements.js';

const algorithmDescriptions = {
    'fcfs': 'First-Come, First-Served (FCFS) is the simplest scheduling algorithm. Processes are executed in the order they arrive in the ready queue.',
    'sjf': 'Shortest Job First (SJF) scheduling algorithm selects the process with the smallest burst time for execution. This reduces the average waiting time.',
    'npp': 'Non-Preemptive Priority (NPP) scheduling algorithm assigns a priority to each process. The process with the highest priority is executed first. Once a process starts, it runs until completion.',
    'preemptive-priority': 'Preemptive Priority scheduling algorithm also assigns priorities to processes. However, if a higher-priority process arrives while a lower-priority process is running, the lower-priority process is preempted and the higher-priority process takes over.'
};

export function setupAlgorithmInfo() {
    menuIcon.addEventListener('click', () => {
        algorithmMenuOverlay.style.display = algorithmMenuOverlay.style.display === 'block' ? 'none' : 'block';
    });

    algorithmMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const algorithm = item.getAttribute('data-algorithm');
            popupAlgorithmName.textContent = item.textContent;
            popupAlgorithmDescription.textContent = algorithmDescriptions[algorithm] || 'Description not available.';
            algorithmInfoPopup.style.display = 'block';
            algorithmMenuOverlay.style.display = 'none'; // Hide the menu after selection
        });
    });

    clearButton.addEventListener('click', () => {
        algorithmInfoPopup.style.display = 'none';
    });
}