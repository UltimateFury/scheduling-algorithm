// js/main.js
import { setupAlgorithmInfo } from './algorithm-info.js';
import { setupJobTable, resetJobCount } from './job-table.js';
import { setupAlgorithmExecution } from './algorithm-execution.js';
import { setupResetFunctionality } from './reset-functionality.js';
import { setupClearButton } from './clear-button.js';

let jobCounter = 3; // Start at 3 since P1 and P2 are default

function addJobRow() {
    const tbody = document.getElementById('job-table-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="job-name" value="P${jobCounter}"></td>
        <td><input type="number" class="arrival-time" value="0"></td>
        <td><input type="number" class="burst-time" value="0"></td>   // Changed to 0
        <td><input type="number" class="priority" value="0"></td>     // Changed to 0
    `;
    tbody.appendChild(row);
    jobCounter++;
}

document.addEventListener('DOMContentLoaded', () => {
    setupAlgorithmInfo();
    setupJobTable();
    setupAlgorithmExecution();
    setupResetFunctionality();
    setupClearButton();

    const guideButton = document.querySelector('.guide-button');
    const guidePopup = document.querySelector('.guide-popup');
    const clearButton = document.querySelector('.clear-button');

    guideButton.addEventListener('click', () => {
        guidePopup.style.display = 'block';
    });

    clearButton.addEventListener('click', () => {
        guidePopup.style.display = 'none';
    });
});

document.querySelector('.refresh-button').addEventListener('click', () => {
    // Clear all job rows except the first two
    const tbody = document.getElementById('job-table-body');
    while (tbody.rows.length > 2) {
        tbody.deleteRow(2);
    }
    // Reset the values of the first two rows
    tbody.rows[0].querySelector('.job-name').value = 'P1';
    tbody.rows[1].querySelector('.job-name').value = 'P2';
    tbody.rows[0].querySelector('.arrival-time').value = 0;
    tbody.rows[1].querySelector('.arrival-time').value = 1;
    tbody.rows[0].querySelector('.burst-time').value = 5;
    tbody.rows[1].querySelector('.burst-time').value = 3;
    tbody.rows[0].querySelector('.priority').value = 1;
    tbody.rows[1].querySelector('.priority').value = 3;
    // Reset jobCount for new jobs
    resetJobCount();
});