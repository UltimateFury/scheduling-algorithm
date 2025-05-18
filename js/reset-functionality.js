// js/reset-functionality.js
import { refreshButton, jobTableBody, algorithmRadios, chosenAlgorithmName, turnaroundTimesDiv, waitingTimesDiv, cpuUtilizationValueDiv, ganttChartDiv, timelineDiv, outputSection } from './elements.js';

let jobCount = 3; // Initial job count

export function setupResetFunctionality() {
    refreshButton.addEventListener('click', () => {
        // Clear added rows from the table
        while (jobTableBody.rows.length > 2) {
            jobTableBody.deleteRow(2);
        }
        jobCount = 3; // Reset job counter

        // Reset input fields in the initial two rows
        jobTableBody.rows[0].cells[0].querySelector('.job-name').value = 'P1';
        jobTableBody.rows[0].cells[1].querySelector('.arrival-time').value = '0';
        jobTableBody.rows[0].cells[2].querySelector('.burst-time').value = '0';
        jobTableBody.rows[0].cells[3].querySelector('.priority').value = '0';

        jobTableBody.rows[1].cells[0].querySelector('.job-name').value = 'P2';
        jobTableBody.rows[1].cells[1].querySelector('.arrival-time').value = '0';
        jobTableBody.rows[1].cells[2].querySelector('.burst-time').value = '0';
        jobTableBody.rows[1].cells[3].querySelector('.priority').value = '0';

        // Deselect any selected algorithm
        algorithmRadios.forEach(radio => {
            radio.checked = false;
        });

        // Clear results
        chosenAlgorithmName.textContent = '';
        turnaroundTimesDiv.innerHTML = `
            <div>tt <span class="job-id"></span> = <span class="tt-value"></span></div>
            <div>tt <span class="job-id"></span> = <span class="tt-value"></span></div>
            <div>tt <span class="job-id"></span> = <span class="tt-value"></span></div>
            <div>tt <span class="job-id"></span> = <span class="tt-value"></span></div>
        `;
        waitingTimesDiv.innerHTML = `
            <div>wt <span class="job-id"></span> = <span class="wt-value"></span></div>
            <div>wt <span class="job-id"></span> = <span class="wt-value"></span></div>
            <div>wt <span class="job-id"></span> = <span class="wt-value"></span></div>
            <div>wt <span class="job-id"></span> = <span class="wt-value"></span></div>
        `;
        cpuUtilizationValueDiv.textContent = '';
        ganttChartDiv.innerHTML = '';
        timelineDiv.textContent = '';

        // Hide the "Chosen Algorithm" section
        outputSection.style.display = 'none';
    });
}