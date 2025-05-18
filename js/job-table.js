// js/job-table.js
import { addJobButton, jobTableBody } from './elements.js';

export let jobCount = 3; // Start with 2 initial rows

function enforceNonNegativeInput(inputElement) {
    inputElement.addEventListener('input', () => {
        if (inputElement.type === 'number' && parseInt(inputElement.value) < 0) {
            inputElement.value = 0;
        }
    });
}

export function setupJobTable() {
    addJobButton.addEventListener('click', () => {
        const newRow = jobTableBody.insertRow();
        const cellCount = jobTableBody.rows[0].cells.length;

        for (let i = 0; i < cellCount; i++) {
            const newCell = newRow.insertCell();
            let inputElement;
            switch (i) {
                case 0:
                    const nextJobNum = getLowestMissingJobNumber();
                    newCell.innerHTML = `<input type="text" class="job-name" value="P${nextJobNum}">`;
                    inputElement = newCell.querySelector('.job-name');
                    break;
                case 1:
                    newCell.innerHTML = `<input type="number" class="arrival-time" value="0">`;
                    inputElement = newCell.querySelector('.arrival-time');
                    enforceNonNegativeInput(inputElement);
                    break;
                case 2:
                    newCell.innerHTML = `<input type="number" class="burst-time" value="0">`;
                    inputElement = newCell.querySelector('.burst-time');
                    enforceNonNegativeInput(inputElement);
                    break;
                case 3:
                    newCell.innerHTML = `<input type="number" class="priority" value="0">`;
                    inputElement = newCell.querySelector('.priority');
                    enforceNonNegativeInput(inputElement);
                    break;
                case 4:
                    // Remove button
                    newCell.innerHTML = `<button class="remove-job-button" style="background:#e74c3c;color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:1em;cursor:pointer;">-</button>`;
                    newCell.style.textAlign = "center";
                    break;
            }
            if (inputElement && inputElement.type === 'number') {
                enforceNonNegativeInput(inputElement);
            }
        }

        // Add event listener for remove button
        const removeBtn = newRow.querySelector('.remove-job-button');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                newRow.remove();
            });
        }
    });

    // Apply the non-negative constraint to the initial input fields
    const initialNumberInputs = jobTableBody.querySelectorAll('input[type="number"]');
    initialNumberInputs.forEach(input => enforceNonNegativeInput(input));

    // Reset input fields in the initial two rows
    jobTableBody.rows[0].cells[0].querySelector('.job-name').value = 'P1';
    jobTableBody.rows[0].cells[1].querySelector('.arrival-time').value = '0';
    jobTableBody.rows[0].cells[2].querySelector('.burst-time').value = '0'; // Set to 0
    jobTableBody.rows[0].cells[3].querySelector('.priority').value = '0';   // Set to 0

    jobTableBody.rows[1].cells[0].querySelector('.job-name').value = 'P2';
    jobTableBody.rows[1].cells[1].querySelector('.arrival-time').value = '0'; // Set to 0
    jobTableBody.rows[1].cells[2].querySelector('.burst-time').value = '0';   // Set to 0
    jobTableBody.rows[1].cells[3].querySelector('.priority').value = '0';     // Set to 0

    document.querySelector('.refresh-button').addEventListener('click', () => {
        // Reset the job count
        resetJobCount();

        // Remove all rows except the first two (P1 and P2)
        while (jobTableBody.rows.length > 2) {
            jobTableBody.deleteRow(2);
        }

        // Reset input fields in the first two rows
        jobTableBody.rows[0].cells[0].querySelector('.job-name').value = 'P1';
        jobTableBody.rows[0].cells[1].querySelector('.arrival-time').value = '0';
        jobTableBody.rows[0].cells[2].querySelector('.burst-time').value = '0';
        jobTableBody.rows[0].cells[3].querySelector('.priority').value = '0';

        jobTableBody.rows[1].cells[0].querySelector('.job-name').value = 'P2';
        jobTableBody.rows[1].cells[1].querySelector('.arrival-time').value = '0';
        jobTableBody.rows[1].cells[2].querySelector('.burst-time').value = '0';
        jobTableBody.rows[1].cells[3].querySelector('.priority').value = '0';
    });

    document.getElementById('subtract-job-button').addEventListener('click', () => {
        // Adjust the selector to match your table's tbody
        const jobTableBody = document.querySelector('#job-table tbody') || document.getElementById('job-table-body');
        if (jobTableBody && jobTableBody.rows.length > 0) {
            jobTableBody.deleteRow(jobTableBody.rows.length - 1);
        }
    });
}

export function resetJobCount() {
    jobCount = 3;
}

function getLowestMissingJobNumber() {
    // Collect all current job numbers
    const existingNumbers = Array.from(jobTableBody.rows).map(row => {
        const jobCell = row.cells[0];
        let val = '';
        if (jobCell.querySelector('input')) {
            val = jobCell.querySelector('input').value;
        } else {
            val = jobCell.textContent;
        }
        const match = val.match(/^P(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
    }).filter(n => n !== null);
    // Find the lowest missing number starting from 1
    let n = 1;
    while (existingNumbers.includes(n)) n++;
    return n;
}