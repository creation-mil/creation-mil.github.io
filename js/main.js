// define variables for updating timer displayed on client.
let timerInterval = null;
let totalElapsedTime = 0;
let startTime = null;
let stopTime = null;

let elapsedTimer = new Timer();
let currentProcessTimer = new Timer();

let table = []

let ipnString = "";
let stationString = "";

function TableEntry() {
    this.startTime;
    this.endTime;
    this.totalTime;
};

// constants
const MILISECONDS_PER_HOUR = 3600000;
const TIMER_UPDATE_INTERVAL_MILISECONDS = 50;

timerInterval = setInterval(() => {
    document.getElementById('stopwatch-total-elapsed-time').innerText = timeToString(elapsedTimer.getElapsedTime());
    document.getElementById('stopwatch-current-process-time').innerText = timeToString(currentProcessTimer.getElapsedTime());
}, TIMER_UPDATE_INTERVAL_MILISECONDS);

/** 
 *  This function logs the time this function was called and consistently updates an elapsed time variable.
 */
function startTimer() {

    // first we need to log the previous entry
    if (elapsedTimer.isActive()) {

        // get the start, stop, and elapsed times. Format them

        let entry = new TableEntry();
        let stopTime = new Date(Date.now()).toLocaleTimeString();
        let elapsedTime = timeToString(currentProcessTimer.getElapsedTime());
        let startTime = new Date(Date.now() - currentProcessTimer.getElapsedTime()).toLocaleTimeString();

        entry.startTime = startTime;
        entry.stopTime = stopTime;
        entry.elapsedTime = elapsedTime;
        
        table.push(entry);
    
        insertRowIntoTable(document.getElementById('entries-table'), entry);
    }

    // if the elapsed timer is inactive, or it is paused, start the timer (which also resets it.)
    // this is used to keep track of the total elapsed time without erasing it.
    if (!elapsedTimer.isActive() || elapsedTimer.isPaused()) {
        elapsedTimer.start();
    }

    // check if the elapsed timer has ever been used.
    if (currentProcessTimer.isActive()) currentProcessTimer.stop();

    currentProcessTimer.start();

    updateStartButtonStatus();
}

/**
 * This function pauses the timer.
 */
function pauseTimer() {
    elapsedTimer.pause();
    currentProcessTimer.pause();

    updateStartButtonStatus();
}

/**
 * This function stops the timer and inputs the elapsed time into the entry table.
 */
function stopTimer() {
    elapsedTimer.stop();
    currentProcessTimer.stop();

    updateStartButtonStatus();
}

function insertRowIntoTable(DOMReference, entry) {
    if (DOMReference.tagName.toLowerCase() !== "table") throw new DOMException.INVALID_NODE_TYPE_ERR;

    let newRow = DOMReference.tBodies[0].insertRow();

    newRow.insertCell(0).textContent = entry.startTime;
    newRow.insertCell(1).textContent = entry.stopTime;
    newRow.insertCell(2).textContent = entry.elapsedTime;
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

/**
 * Exports all entries in the time table to a csv file.
 */
function exportEntryTableToCSV() {
    csvBuilder = "";

    csvBuilder += "Start Time" + "," + "Stop Time" + "," + "Elapsed Time" + "\n";

    table.forEach(e => {
        csvBuilder += e.startTime + "," + e.stopTime + "," + e.elapsedTime + "\n";
    });

    download("export.csv",csvBuilder);

function setIpnEventHandler() {
    let ipn = window.prompt("Enter IPN:");

    ipn = sanitizeString(ipn);
    ipn = ipn.toUpperCase();

    ipnString = ipn;
}

function setStationNameEventHandler() {
    let stationName = window.prompt("Enter Station Name:")

    stationName = sanitizeString(stationName);
    stationName.toLowerCase(stationName);

    stationString = stationName;
}

function updateStartButtonStatus() {

    let button = document.getElementById('start-button');

    switch (currentProcessTimer.isPaused()) {
        case (true):
            button.innerText = "Resume";
            break;
        case (false):
            button.innerText = "Start New Process";
    }
}
    // Event listeners for buttons
    document.getElementById('start-button').addEventListener('click', startTimer);
    document.getElementById('pause-button').addEventListener('click', pauseTimer);
    document.getElementById('reset-button').addEventListener('click', stopTimer);
    document.getElementById('export-button').addEventListener('click', exportEntryTableToCSV);
    document.getElementById('clear-button').addEventListener('click', clearEntryTable);
    document.getElementById('set-ipn-button').addEventListener('click', setIpnEventHandler);
    document.getElementById('set-station-button').addEventListener('click', setStationNameEventHandler);
