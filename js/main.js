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

/** 
 *  This function logs the time this function was called and consistently updates an elapsed time variable.
 */
function startTimer() {

    // first we need to log the previous entry
    if (elapsedTimer.isActive() && !elapsedTimer.isPaused()) {

        // get the start, stop, and elapsed times. Format them
        let entry = new TableEntry();
        let stopTime = new Date(Date.now()).toLocaleTimeString();
        let elapsedTime = timeToString(currentProcessTimer.getElapsedTime());
        let startTime = new Date(Date.now() - currentProcessTimer.getElapsedTime()).toLocaleTimeString();

        // encapsulate times into an entry object and add to the table
        entry.startTime = startTime;
        entry.stopTime = stopTime;
        entry.elapsedTime = elapsedTime;
        table.push(entry);
    
        // update html to display new time entry.
        insertRowIntoTable(document.getElementById('entries-table'), entry);
    }

    // if the elapsed timer is inactive, or it is paused, start the timer (which also resets it.)
    // this is used to keep track of the total elapsed time without erasing it.
    if (!elapsedTimer.isActive() || elapsedTimer.isPaused()) {
        elapsedTimer.start();
    }

    // check if the elapsed timer has ever been used.
    if (currentProcessTimer.isActive() && !currentProcessTimer.isPaused()) currentProcessTimer.stop();

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
    // prevent non-table's from being passed through this function
    if (DOMReference.tagName.toLowerCase() !== "table") throw new DOMException.INVALID_NODE_TYPE_ERR;

    // insert the entry into the table.
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

    // create a link element to store text inside
    var element = document.createElement('a');

    //encode URI blob
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));

    // sets the name of the download
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    // force browser to "click" on the link and start the download
    element.click();

    document.body.removeChild(element);
}

/**
 * Exports all entries in the time table to a csv file.
 */
function exportEntryTableToCSV() {
    // ensure ipn or station string are not blank.
    if (ipnString.trim() === "" || stationString.trim() === "") {
        window.alert("IPN and Station Name must not be blank!");
        return;
    }

    
    csvBuilder = "";

    // Add the headers to the .csv string
    csvBuilder += "IPN" + "," + "Station Name" + "," + "Start Time" + "," + "Stop Time" + "," + "Elapsed Time" + "\n";

    // For each entry in the table collection, add the comma separated values and a newline.
    table.forEach(e => {
        csvBuilder += ipnString + "," + stationString + "," + e.startTime + "," + e.stopTime + "," + e.elapsedTime + "\n";
    });

    // prompt a browser download
    download("export.csv",csvBuilder);123

}

function clearEntryTable() {
    let entriesTable = document.getElementById('entries-table');
    console.log("function");

    // delete the last row until the header row remains.
    while (entriesTable.rows.length > 1) {
        entriesTable.deleteRow(-1);
    }
}


function sanitizeString(str) {
    // prevent null strings from breaking stuff.
    if (str === null) {
        return "";
    }

    // replace bad characters and trim whitespace.
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    return str.trim();
}

function setIpnEventHandler() {
    // prompt user for ipn
    let ipn = window.prompt("Enter IPN:");

    // sanitize string and set it to the global ipn variable
    ipn = sanitizeString(ipn);
    ipn = ipn.toUpperCase();
    ipnString = ipn;

    // Update the text displayed on the html page
    document.getElementById('current-ipn-span').textContent = ipnString;

}

function setStationNameEventHandler() {
    // prompt user for station name
    let stationName = window.prompt("Enter Station Name:")

    // sanitize string and set it to the global station name var
    stationName = sanitizeString(stationName);
    stationName.toLowerCase(stationName);
    stationString = stationName;

    // Update the text displayed on the html page
    document.getElementById('current-station-span').textContent = stationString;
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

function init() {
    // Event listeners for buttons
    document.getElementById('start-button').addEventListener('click', startTimer);
    document.getElementById('pause-button').addEventListener('click', pauseTimer);
    document.getElementById('reset-button').addEventListener('click', stopTimer);
    document.getElementById('export-button').addEventListener('click', exportEntryTableToCSV);
    document.getElementById('clear-button').addEventListener('click', clearEntryTable);
    document.getElementById('set-ipn-button').addEventListener('click', setIpnEventHandler);
    document.getElementById('set-station-button').addEventListener('click', setStationNameEventHandler);

    // Interval to check timer status
    timerInterval = setInterval(() => {
        document.getElementById('stopwatch-total-elapsed-time').innerText = timeToString(elapsedTimer.getElapsedTime());
        document.getElementById('stopwatch-current-process-time').innerText = timeToString(currentProcessTimer.getElapsedTime());
    }, TIMER_UPDATE_INTERVAL_MILISECONDS);
}

// Wait for document load before executing code.
document.addEventListener('DOMContentLoaded', init, false);