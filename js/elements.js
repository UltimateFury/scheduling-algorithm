// js/elements.js
export const addJobButton = document.getElementById('add-job-button');
export const jobTableBody = document.getElementById('job-table-body');
export const displayButton = document.querySelector('.display-button');
export const chosenAlgorithmName = document.getElementById('chosen-algorithm-name');
export const turnaroundTimesDiv = document.getElementById('turnaround-times'); // Make sure this exists
export const waitingTimesDiv = document.getElementById('waiting-times');   // Make sure this exists
export const cpuUtilizationValueDiv = document.getElementById('cpu-utilization-value'); // Make sure this exists
export const timelineDiv = document.querySelector('.timeline');
export const ganttChartDiv = document.querySelector('.gantt-chart');
export const algorithmRadios = document.querySelectorAll('input[name="algorithm"]');
export const outputSection = document.querySelector('.output-section');
export const refreshButton = document.querySelector('.refresh-button');
export const clearButton = document.querySelector('.clear-button');
export const menuIcon = document.querySelector('.menu-icon');
export const algorithmMenuOverlay = document.querySelector('.algorithm-menu-overlay');
export const algorithmMenuItems = document.querySelectorAll('.algorithm-menu-overlay ul li');
export const algorithmInfoPopup = document.querySelector('.algorithm-info-popup');
export const popupAlgorithmName = document.getElementById('popup-algorithm-name');
export const popupAlgorithmDescription = document.getElementById('popup-algorithm-description');
export const closePopup = document.getElementById('close-popup');
export const resultsSection = document.getElementById('results-section'); // You can keep this if you have it