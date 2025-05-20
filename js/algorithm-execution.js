// js/algorithm-execution.js
import { displayButton, chosenAlgorithmName, outputSection, algorithmRadios, jobTableBody, timelineDiv, turnaroundTimesDiv, waitingTimesDiv, cpuUtilizationValueDiv } from './elements.js';
import { renderGanttChart } from './results-display.js'; // Make sure this import is correct

export function setupAlgorithmExecution() {
    displayButton.addEventListener('click', () => {
        const selectedAlgorithm = Array.from(algorithmRadios).find(radio => radio.checked)?.value;
        if (!selectedAlgorithm) {
            alert('Please select a scheduling algorithm.');
            return;
        }

        outputSection.style.display = 'flex';
        chosenAlgorithmName.textContent = selectedAlgorithm.toUpperCase();

        const jobs = getJobData().map(job => ({ ...job, remainingBurstTime: job.burstTime, startTime: 0, completionTime: 0, turnaroundTime: 0, waitingTime: 0, isCompleted: false }));
        let ganttChartData = [];
        let currentTime = 0;
        const completedJobs = [];
        let currentlyRunningJob = null;

        if (selectedAlgorithm === 'fcfs') {
            const sortedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
            const nonPreemptiveJobs = [...sortedJobs].map(job => ({ ...job }));
            nonPreemptiveJobs.forEach(job => {
                if (currentTime < job.arrivalTime) {
                    // Add individual idle segments of duration 1
                    for (let t = currentTime; t < job.arrivalTime; t++) {
                        ganttChartData.push({ job: 'I', start: t, end: t + 1, duration: 1 });
                    }
                    currentTime = job.arrivalTime;
                }
                job.startTime = currentTime;
                job.completionTime = currentTime + job.burstTime;
                job.turnaroundTime = job.completionTime - job.arrivalTime;
                job.waitingTime = job.turnaroundTime - job.burstTime;
                ganttChartData.push({ job: job.job, start: job.startTime, end: job.completionTime, duration: job.burstTime });
                currentTime = job.completionTime;
            });
            updateResultsDisplay(nonPreemptiveJobs, currentTime, jobs.reduce((sum, job) => sum + job.burstTime, 0), ganttChartData);
        } else if (selectedAlgorithm === 'sjf') {
            const nonPreemptiveJobs = [...jobs].map(job => ({ ...job }));
            const arrivedJobs = [];
            let completedJobsCount = 0;
            const n = nonPreemptiveJobs.length;

            while (completedJobsCount < n) {
                nonPreemptiveJobs.forEach(job => {
                    if (job.arrivalTime <= currentTime && !arrivedJobs.includes(job) && !job.isCompleted) {
                        arrivedJobs.push(job);
                    }
                });

                if (arrivedJobs.length > 0) {
                    arrivedJobs.sort((a, b) => a.burstTime - b.burstTime);
                    const nextJob = arrivedJobs[0];
                    arrivedJobs.shift();

                    if (currentTime < nextJob.arrivalTime) {
                        // Add individual idle segments of duration 1
                        for (let t = currentTime; t < nextJob.arrivalTime; t++) {
                            ganttChartData.push({ job: 'I', start: t, end: t + 1, duration: 1 });
                        }
                        currentTime = nextJob.arrivalTime;
                    }

                    nextJob.startTime = currentTime;
                    nextJob.completionTime = currentTime + nextJob.burstTime;
                    nextJob.turnaroundTime = nextJob.completionTime - nextJob.arrivalTime;
                    nextJob.waitingTime = nextJob.turnaroundTime - nextJob.burstTime;
                    ganttChartData.push({ job: nextJob.job, start: nextJob.startTime, end: nextJob.completionTime, duration: nextJob.burstTime });
                    currentTime = nextJob.completionTime;
                    nextJob.isCompleted = true;
                    completedJobsCount++;
                } else {
                    const nextArrivalTime = nonPreemptiveJobs.find(job => !job.isCompleted)?.arrivalTime;
                    if (nextArrivalTime !== undefined && currentTime < nextArrivalTime) {
                        // Add individual idle segments of duration 1
                        for (let t = currentTime; t < nextArrivalTime; t++) {
                            ganttChartData.push({ job: 'I', start: t, end: t + 1, duration: 1 });
                        }
                        currentTime = nextArrivalTime;
                    } else {
                        currentTime++;
                    }
                }
            }
            updateResultsDisplay(nonPreemptiveJobs.filter(job => job.isCompleted), currentTime, jobs.reduce((sum, job) => sum + job.burstTime, 0), ganttChartData);
        } else if (selectedAlgorithm === 'npp') {
            const nonPreemptiveJobs = [...jobs].map(job => ({ ...job }));
            const arrivedJobs = [];
            let completedJobsCount = 0;
            const n = nonPreemptiveJobs.length;

            while (completedJobsCount < n) {
                nonPreemptiveJobs.forEach(job => {
                    if (job.arrivalTime <= currentTime && !arrivedJobs.includes(job) && !job.isCompleted) {
                        arrivedJobs.push(job);
                    }
                });

                if (arrivedJobs.length > 0) {
                    arrivedJobs.sort((a, b) => a.priority - b.priority);
                    const nextJob = arrivedJobs[0];
                    arrivedJobs.shift();

                    if (currentTime < nextJob.arrivalTime) {
                        // Add individual idle segments of duration 1
                        for (let t = currentTime; t < nextJob.arrivalTime; t++) {
                            ganttChartData.push({ job: 'I', start: t, end: t + 1, duration: 1 });
                        }
                        currentTime = nextJob.arrivalTime;
                    }

                    nextJob.startTime = currentTime;
                    nextJob.completionTime = currentTime + nextJob.burstTime;
                    nextJob.turnaroundTime = nextJob.completionTime - nextJob.arrivalTime;
                    nextJob.waitingTime = nextJob.turnaroundTime - nextJob.burstTime;
                    ganttChartData.push({ job: nextJob.job, start: nextJob.startTime, end: nextJob.completionTime, duration: nextJob.burstTime });
                    currentTime = nextJob.completionTime;
                    nextJob.isCompleted = true;
                    completedJobsCount++;
                } else {
                    const nextArrivalTime = nonPreemptiveJobs.find(job => !job.isCompleted)?.arrivalTime;
                    if (nextArrivalTime !== undefined && currentTime < nextArrivalTime) {
                        // Add individual idle segments of duration 1
                        for (let t = currentTime; t < nextArrivalTime; t++) {
                            ganttChartData.push({ job: 'I', start: t, end: t + 1, duration: 1 });
                        }
                        currentTime = nextArrivalTime;
                    } else {
                        currentTime++;
                    }
                }
            }
            updateResultsDisplay(nonPreemptiveJobs.filter(job => job.isCompleted), currentTime, jobs.reduce((sum, job) => sum + job.burstTime, 0), ganttChartData);
        } else if (selectedAlgorithm === 'preemptive-priority') {
            const jobList = jobs.map(job => ({
                ...job,
                remainingBurstTime: job.burstTime,
                isCompleted: false,
                completionTime: 0,
                turnaroundTime: 0,
                waitingTime: 0
            }));
            let ganttChartData = [];
            let readyQueue = [];
            let currentJob = null;
            let lastSwitchTime = 0;
            let completedCount = 0;
            let localCurrentTime = 0;

            while (completedCount < jobList.length) {
                // Add jobs that have arrived
                jobList.forEach(job => {
                    if (
                        job.arrivalTime <= localCurrentTime &&
                        !readyQueue.includes(job) &&
                        !job.isCompleted
                    ) {
                        readyQueue.push(job);
                    }
                });

                // If current job finished, record its segment
                if (currentJob && currentJob.remainingBurstTime === 0) {
                    currentJob.completionTime = localCurrentTime;
                    currentJob.turnaroundTime = currentJob.completionTime - currentJob.arrivalTime;
                    currentJob.waitingTime = currentJob.turnaroundTime - currentJob.burstTime;
                    currentJob.isCompleted = true;
                    ganttChartData.push({
                        job: currentJob.job,
                        start: lastSwitchTime,
                        end: localCurrentTime,
                        duration: localCurrentTime - lastSwitchTime
                    });
                    currentJob = null;
                    completedCount++;
                }

                // Remove completed jobs from readyQueue
                readyQueue = readyQueue.filter(job => !job.isCompleted);

                // Sort ready queue by priority, then arrival time
                readyQueue.sort((a, b) => {
                    if (a.priority !== b.priority) return a.priority - b.priority;
                    return a.arrivalTime - b.arrivalTime;
                });

                let nextJob = null;
                if (readyQueue.length > 0) {
                    if (!currentJob) {
                        // CPU was idle, pick the highest priority job
                        nextJob = readyQueue[0];
                        lastSwitchTime = localCurrentTime;
                    } else if (readyQueue[0].priority < currentJob.priority) {
                        // Preempt current job
                        ganttChartData.push({
                            job: currentJob.job,
                            start: lastSwitchTime,
                            end: localCurrentTime,
                            duration: localCurrentTime - lastSwitchTime
                        });
                        readyQueue.push(currentJob);
                        nextJob = readyQueue[0];
                        lastSwitchTime = localCurrentTime;
                    } else {
                        nextJob = currentJob;
                    }
                }

                if (nextJob) {
                    currentJob = nextJob;
                    currentJob.remainingBurstTime--;
                    localCurrentTime++;
                } else if (completedCount < jobList.length) {
                    // CPU idle only if jobs remain
                    ganttChartData.push({
                        job: 'I',
                        start: localCurrentTime,
                        end: localCurrentTime + 1,
                        duration: 1
                    });
                    localCurrentTime++;
                }
            }

            // If a job was running at the very end, record its last segment
            if (currentJob && currentJob.remainingBurstTime === 0) {
                ganttChartData.push({
                    job: currentJob.job,
                    start: lastSwitchTime,
                    end: localCurrentTime,
                    duration: localCurrentTime - lastSwitchTime
                });
            }

            updateResultsDisplay(jobList.filter(job => job.isCompleted), localCurrentTime, jobs.reduce((sum, job) => sum + job.burstTime, 0), ganttChartData);
            renderGanttChart(ganttChartData, localCurrentTime);
            renderTimeline(jobList, localCurrentTime);
            return;
        }

        renderGanttChart(ganttChartData, currentTime);
        renderTimeline(jobs); // Call the new renderTimeline function
    });
}

function getJobData() {
    const rows = jobTableBody.querySelectorAll('tr');
    const jobs = [];
    rows.forEach((row, index) => {
        const jobName = row.querySelector('.job-name').value;
        const arrivalTime = parseInt(row.querySelector('.arrival-time').value);
        const burstTime = parseInt(row.querySelector('.burst-time').value);
        const priority = parseInt(row.querySelector('.priority').value) || 0;
        jobs.push({ job: jobName, arrivalTime, burstTime, priority, id: index + 1, remainingBurstTime: burstTime });
    });
    return jobs;
}

function renderTimeline(jobs) {
    timelineDiv.innerHTML = ''; // Clear the previous content

    if (jobs.length === 0) {
        timelineDiv.textContent = 'No jobs to display on the timeline.';
        return;
    }

    const sortedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeline = document.createElement('div');
    timeline.classList.add('timeline');

    sortedJobs.forEach((job, index) => {
        const container = document.createElement('div');
        container.classList.add('container');
        container.classList.add(index % 2 === 0 ? 'left' : 'right');

        const content = document.createElement('div');
        content.classList.add('content');

        const jobNameLabel = document.createElement('div');
        jobNameLabel.classList.add('job-name-label');
        jobNameLabel.textContent = job.job;

        const arrivalTimeParagraph = document.createElement('p');
        arrivalTimeParagraph.textContent = `${job.arrivalTime}`; // Removed "Arrival Time: "

        content.appendChild(jobNameLabel);
        content.appendChild(arrivalTimeParagraph);
        container.appendChild(content);
        timeline.appendChild(container);
    });

    timelineDiv.appendChild(timeline);
}

function updateResultsDisplay(jobs, totalCompletionTime, totalBurstTime, ganttChartData) {
    // Clear previous results
    if (!turnaroundTimesDiv || !waitingTimesDiv || !cpuUtilizationValueDiv) {
        return; // Ensure the target elements exist
    }
    turnaroundTimesDiv.innerHTML = '';
    waitingTimesDiv.innerHTML = '';
    cpuUtilizationValueDiv.textContent = '';

    if (jobs.length === 0) {
        turnaroundTimesDiv.textContent = 'No jobs to display turnaround time for.';
        waitingTimesDiv.textContent = 'No jobs to display waiting time for.';
        cpuUtilizationValueDiv.textContent = 'N/A';
        return;
    }

    // Sort jobs by their original id to ensure P1, P2, ... order
    const jobsInOrder = [...jobs].sort((a, b) => a.id - b.id);

    // Turnaround Time
    let totalTurnaroundTime = 0;
    let turnaroundTable = `<div style="overflow-x:auto;"><table style="margin:auto; width:100%; border-collapse:collapse;">
        <tbody>`;
    jobsInOrder.forEach(job => {
        turnaroundTable += `
        <tr>
            <td style="text-align:center; min-width:60px; font-size: 1.5em;">tt<sub>${job.id}</sub></td>
            <td style="text-align:center; min-width:20px;">=</td>
            <td style="text-align:center; min-width:40px;">${job.completionTime}</td>
            <td style="text-align:center; min-width:20px;">-</td>
            <td style="text-align:center; min-width:40px;">${job.arrivalTime}</td>
            <td style="text-align:center; min-width:20px;">=</td>
            <td style="text-align:center; min-width:40px;">${job.turnaroundTime}</td>
        </tr>`;
        totalTurnaroundTime += job.turnaroundTime;
    });
    const averageTurnaroundTime = totalTurnaroundTime / jobs.length;
    turnaroundTable += `
        <tr>
            <td style="text-align:center; font-size: 1.5em;">tt<sub>ave</sub></td>
            <td style="text-align:center;">=</td>
            <td style="text-align:center;">${totalTurnaroundTime}</td>
            <td style="text-align:center;">/</td>
            <td style="text-align:center;">${jobs.length}</td>
            <td style="text-align:center;">=</td>
            <td style="text-align:center; word-spacing: 0px;">${averageTurnaroundTime.toFixed(2)} ms</td>
        </tr>
    </tbody></table></div>`;
    turnaroundTimesDiv.innerHTML = turnaroundTable;

    // Waiting Time
    let totalWaitingTime = 0;
    let waitingTable = `<div style="overflow-x:auto;"><table style="margin:auto; width:100%; border-collapse:collapse;">
        <tbody>`;
    jobsInOrder.forEach(job => {
        const waitingTime = job.turnaroundTime - job.burstTime;
        waitingTable += `
        <tr>
            <td style="text-align:center; min-width:60px; font-size: 1.5em;">wt<sub>${job.id}</sub></td>
            <td style="text-align:center; min-width:20px;">=</td>
            <td style="text-align:center; min-width:40px;">${job.turnaroundTime}</td>
            <td style="text-align:center; min-width:20px;">-</td>
            <td style="text-align:center; min-width:40px;">${job.burstTime}</td>
            <td style="text-align:center; min-width:20px;">=</td>
            <td style="text-align:center; min-width:40px;">${waitingTime}</td>
        </tr>`;
        totalWaitingTime += waitingTime;
        job.waitingTime = waitingTime; // Update the job object
    });
    const averageWaitingTime = totalWaitingTime / jobs.length;
    waitingTable += `
        <tr>
            <td style="text-align:center; font-size: 1.5em;">wt<sub>ave</sub></td>
            <td style="text-align:center;">=</td>
            <td style="text-align:center;">${totalWaitingTime}</td>
            <td style="text-align:center;">/</td>
            <td style="text-align:center;">${jobs.length}</td>
            <td style="text-align:center;">=</td>
            <td style="text-align:center; word-spacing: 0px;">${averageWaitingTime.toFixed(2)} ms</td>
        </tr>
    </tbody></table></div>`;
    waitingTimesDiv.innerHTML = waitingTable;

    // CPU Utilization Solution Steps
    const totalBurst = jobs.reduce((sum, job) => sum + job.burstTime, 0);
    const cpuUtil = (totalBurst / totalCompletionTime) * 100;

    // Use ganttChartData for denominator
    let denominatorParts = [];
    if (ganttChartData && ganttChartData.length > 0) {
        denominatorParts = ganttChartData.map(item => item.duration);
    } else {
        denominatorParts = jobs.map(job => job.burstTime); // fallback
    }
    const denominatorString = denominatorParts.join(' + ');

    let solution = `
        <div class="cpu-util-formula" style="'Libre Baskerville', serif !important; font-size: 0.7em;">
            <span>(${totalBurst} / (${denominatorString})) = (${totalBurst} / ${totalCompletionTime}) * 100 = </span>
            <span class="result">${cpuUtil.toFixed(2)}%</span>
        </div>
    `;

    cpuUtilizationValueDiv.innerHTML = solution;
}
