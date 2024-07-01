/**
 * This class defines a Timer object that keeps track of timestamps, current times. It supports starting, stopping, pausing, and lapping of times.
 */
class Timer {
    // variables to keep track of timestamps when the timer was stopped and started.
    #startTimestamp = null;
    #stopTimestamp = null;
    #pauseBeginTimestamp = null;
    #pauseEndTimestamp = null;
    #elapsedTimeOnPause = 0;

    // some flags to keep track of the timer status
    #timerActive = false;
    #timerPaused = false;
    #timerEverPaused = false;
    
    constructor() {}

    start() {
        if (this.#timerPaused) {
            this.#pauseEndTimestamp = new Date().getTime();
            this.#timerPaused = false;

            // calculate the elapsed paused time.
            this.#elapsedTimeOnPause += this.#pauseEndTimestamp - this.#pauseBeginTimestamp;
        } else {
            this.#startTimestamp = new Date().getTime();
            this.#elapsedTimeOnPause = 0;
        }

        this.#timerActive = true;
    }


    stop() {

        // prevent stopping a nonexistent timer
        if (!this.#timerActive) {
            throw new DOMException();
        }

        // unpause the timer if it's being stopped.
        if (this.#timerPaused) {
            this.#timerPaused = false;
        }

        this.#timerActive = false;
    }

    pause() {

        // prevent pausing a nonexistent timer
        if (!this.#timerActive) {
            throw new DOMException();
        }

        // pause the timer
        if (!this.#timerPaused) {
            this.#pauseBeginTimestamp = new Date().getTime();
            this.#timerPaused = true;
            this.#timerEverPaused = true;
        }
    }

    getStartTime() {
        return this.#startTimestamp;
    }

    getElapsedTime() {

        if (!this.#timerActive) return 0;

        // timer has never been paused, so we want the current time subtracted by the start timestamp
        if (!this.#timerEverPaused) {
            return Date.now() - this.#startTimestamp;
        }

        // timer has been paused, but is currently active, so we neeed to subtract off the elapsed paused time from the total time.
        if (!this.#timerPaused) {
            return Date.now() - this.#startTimestamp - this.#elapsedTimeOnPause;
        }

        // timer is currently paused
        return this.#pauseBeginTimestamp - this.#startTimestamp - this.#elapsedTimeOnPause;
    }

    isActive() {
        return this.#timerActive;
    }

    isPaused() {
        return this.#timerPaused;
    }
}