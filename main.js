// define variables for updating timer displayed on client.
let timerInterval = null;
let elapsedTime = 0;
let startTime = null;
let stopTime = null;

const MILISECONDS_PER_HOUR = 3600000;

/** 
 *  This function logs the time this function was called and consistently updates an elapsed time variable.
 */
function startTimer() {
    if (timerInterval === null) return; // Prevent multiple intervals

    startTime = new Date(); // log the time which the start button was clicked.
    const startTimestamp = startTime.getTime();

    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTimestamp;
        document.getElementById('timer').textContent = timeToString(elapsedTime);
    }, 50);
}

function stopTimer() {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
    stopTime = new Date();

    // Log the start time, stop time, and total time
    const logTable = document.getElementById('logTable');
    const newRow = logTable.insertRow();
    newRow.insertCell(0).textContent = startTime.toLocaleTimeString();
    newRow.insertCell(1).textContent = stopTime.toLocaleTimeString();
    newRow.insertCell(2).textContent = timeToString(elapsedTime);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    document.getElementById('timer').textContent = '00:00:00';
}

/**
 * This function converts a given time from Javascript's Date object, and returns it as a human-readable formatted String.
 * @param {double} time 
 * @returns {String} The formatted time as a string.  
 */
function timeToString(time) {
    // get the elapsed total hours as a decimal number.
    let diffInHrs = time / MILISECONDS_PER_HOUR;
    let hh = Math.floor(diffInHrs);

    // get the elapsed total minutes
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    // get the elapsed total seconds
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    // get the elapsed total tenth of seconds
    let diffInTenthSec = (diffInSec - ss) * 10;
    let tss = Math.floor(diffInTenthSec);

    let formattedHH = hh.toString().padStart(2, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedTSS = tss.toString().padStart(1,"0");

    return `${formattedHH}:${formattedMM}:${formattedSS}.${formattedTSS}`;
}