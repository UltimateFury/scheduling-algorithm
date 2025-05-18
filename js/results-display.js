// js/results-display.js
import { turnaroundTimesDiv, waitingTimesDiv, cpuUtilizationValueDiv, ganttChartDiv, timelineDiv } from './elements.js';

export function updateResultsDisplay(jobs, totalCompletionTime, totalBurstTime) {
    turnaroundTimesDiv.innerHTML = jobs.map(job => `<div>tt ${job.job} = ${job.turnaroundTime}</div>`).join('');
    waitingTimesDiv.innerHTML = jobs.map(job => `<div>wt ${job.job} = ${job.waitingTime}</div>`).join('');
    const cpuUtilization = (totalBurstTime / totalCompletionTime) * 100 || 0;
    cpuUtilizationValueDiv.textContent = `${cpuUtilization.toFixed(2)}%`;
}

export function renderGanttChart(ganttChartData, totalCompletionTime) {
    ganttChartDiv.innerHTML = '';
    const ganttChartContainer = document.createElement('div');
    ganttChartContainer.classList.add('gantt-chart-container');
    const timelineContainer = document.createElement('div');
    timelineContainer.classList.add('gantt-timeline-container');

    // Add the initial time marker at 0
    const initialTimeMarker = document.createElement('div');
    initialTimeMarker.classList.add('gantt-time-marker');
    initialTimeMarker.textContent = '0';
    initialTimeMarker.style.left = '0%';
    timelineContainer.appendChild(initialTimeMarker);

    // --- Burst time labels above bars ---
    ganttChartData.forEach(item => {
        const barWidthPercentage = (item.duration / totalCompletionTime) * 100;
        const barStartPercentage = (item.start / totalCompletionTime) * 100;

        // Burst time label (above the bar, centered)
        const burstLabel = document.createElement('div');
        burstLabel.classList.add('gantt-burst-label');
        burstLabel.textContent = item.duration;
        burstLabel.style.position = 'absolute';
        burstLabel.style.left = `calc(${barStartPercentage}% + ${barWidthPercentage / 2}%)`;
        burstLabel.style.top = '-22px';
        burstLabel.style.transform = 'translateX(-50%)';
        ganttChartContainer.appendChild(burstLabel);
    });

    ganttChartData.forEach(item => {
        const barWidthPercentage = (item.duration / totalCompletionTime) * 100;
        const barStartPercentage = (item.start / totalCompletionTime) * 100;
        const barColor = item.job === 'I' ? 'gray' : '';

        // Gantt bar
        const bar = document.createElement('div');
        bar.classList.add('gantt-chart-bar');
        bar.style.left = `${barStartPercentage}%`;
        bar.style.width = `${barWidthPercentage}%`;
        bar.style.backgroundColor = barColor;
        bar.textContent = item.job;
        ganttChartContainer.appendChild(bar);

        // Time marker at the end of this segment
        const timeMarker = document.createElement('div');
        timeMarker.classList.add('gantt-time-marker');
        timeMarker.textContent = item.end;
        timeMarker.style.left = `${(item.end / totalCompletionTime) * 100}%`;
        timelineContainer.appendChild(timeMarker);
    });

    ganttChartDiv.appendChild(ganttChartContainer);
    ganttChartDiv.appendChild(timelineContainer);
}

export function renderTimeline(jobs, totalCompletionTime) {
    timelineDiv.innerHTML = '';
    const timelineContainer = document.createElement('div');
    timelineContainer.classList.add('timeline-container-inner');

    // Create the main horizontal timeline line
    const timelineLine = document.createElement('div');
    timelineLine.classList.add('timeline-line');
    timelineContainer.appendChild(timelineLine);

    // Plot arrival times
    jobs.forEach(job => {
        const arrivalTime = job.arrivalTime;
        const position = (arrivalTime / totalCompletionTime) * 100;

        const arrivalMarker = document.createElement('div');
        arrivalMarker.classList.add('arrival-marker');
        arrivalMarker.style.left = `${position}%`;

        const jobNameLabel = document.createElement('div');
        jobNameLabel.classList.add('job-name-label');
        jobNameLabel.textContent = job.job;

        const arrivalTimeLabel = document.createElement('div');
        arrivalTimeLabel.classList.add('arrival-time-label');
        arrivalTimeLabel.textContent = arrivalTime;
        content.appendChild(arrivalTimeLabel);

        arrivalMarker.appendChild(jobNameLabel);
        arrivalMarker.appendChild(arrivalTimeLabel);
        timelineContainer.appendChild(arrivalMarker);
    });

    timelineDiv.appendChild(timelineContainer);
}