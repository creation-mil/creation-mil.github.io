// define variables for updating timer displayed on client.
let timerInterval = null;
let totalElapsedTime = 0;
let startTime = null;
let stopTime = null;

// variables to track the timestamp of each timer.
let totalElapsedTimeStartTimestamp = null;
let totalProcessTimeStartTimestamp = null;

// constants
const MILISECONDS_PER_HOUR = 3600000;

/** 
 *  This function logs the time this function was called and consistently updates an elapsed time variable.
 */
function startTimer() {
    if (timerInterval !== null) return; // Prevent multiple intervals

    let timestamp = new Date().getTime();

    // Update the total elapsed time timestamp if we have not started a timer yet.
    if (totalElapsedTimeStartTimestamp === null) {
        totalElapsedTimeStartTimestamp = timestamp;
    }

    // Update the current process time timestamp
    totalProcessTimeStartTimestamp = timestamp;

    timerInterval = setInterval(() => {
        totalElapsedTime = Date.now() - totalElapsedTimeStartTimestamp;
        totalProcessTime = Date.now() - totalProcessTimeStartTimestamp;
        
        document.getElementById('stopwatch-total-elapsed-time').innerText = timeToString(totalElapsedTime);
        document.getElementById('stopwatch-current-process-time').innerText = timeToString(totalProcessTime);
    }, 50);
}

/**
 * This function stops the timer and inputs the elapsed time into the entry table.
 */
function stopTimer() {
    if (!timerInterval) return; // Prevent stopping a nonexistent IntervalID
    clearInterval(timerInterval);
    timerInterval = null;
    stopTime = new Date();

    // Log the start time, stop time, and total time
    const logTable = document.getElementById('logTable');
    const newRow = logTable.insertRow();
    newRow.insertCell(0).textContent = startTime.toLocaleTimeString();
    newRow.insertCell(1).textContent = stopTime.toLocaleTimeString();
    newRow.insertCell(2).textContent = timeToString(totalElapsedTime);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    totalElapsedTime = 0;
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

    let formattedHH = hh.toString().padStart(1, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedTSS = tss.toString().padStart(1,"0");

    return `${formattedHH}:${formattedMM}:${formattedSS}.${formattedTSS}`;
}

/**
 * This function invokes a browser download of any specified text file and allows for naming the text file.
 * @param {String} filename String of the filename of the downloaded file.
 * @param {String} text String of the text included in the filename.
 */
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}