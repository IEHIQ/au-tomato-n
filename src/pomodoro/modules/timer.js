import { checkFunctionArgument, checkNumberArgument } from "./checkUtils";

/**
 * Represents a countdown timer
 */
export default class Timer {
    /**
     * Represents a countdown timer
     * @param {number} time - time to countdown in seconds
     */
    constructor(time) {
        /**
         * remaining time in seconds
         */
        this._time = checkNumberArgument(time);

        /**
         * SetInterval timer
         */
        this._timer = null;

        /**
         * events that timer will be firing
         */
        this._events = {
            /**
             * fires when time changes
             */
            onTick: ((time) => { console.log(`Tick : ${time}`); }),
            /**
             * fires when time is ran out
             */
            onStop: (() => { console.log(`Timer stopped`); })
        };
    }

    /**
     * Sets new time
     * @param {number} value - new time value in seconds
     */
    setTime(value) {
        this._time = checkNumberArgument(value, this._time);
    }

    /**
     * Returns current time
     * @returns remaining time in seconds
     */
    getTime() {
        return this._time;
    }

    /**
     * Sets events
     * @param {object} value - object with new events
     */
    setEvents(value) {
        this._events = value && {
            onTick: checkFunctionArgument(value.onTick, this._events.onTick),
            onStop: checkFunctionArgument(value.onStop, this._events.onStop)
        }
    }

    _tick() {
        if (this._time === 0) {
            this.stop();
            this._events.onStop();
        }
        else {
            this._time--;
            this._events.onTick(this._time);
        }
    }

    /**
     * Starts timer
     */
    start() {
        // clearing interval before initializing new one (just in case)
        this.stop();
        // start
        this._timer = setInterval(this._tick.bind(this), 1000);
    }

    /**
     * Stops timer
     */
    stop() {
        clearInterval(this._timer);
    }
}
