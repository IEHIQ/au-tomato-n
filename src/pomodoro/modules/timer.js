/**
 * Checks if arg is a function
 * @param {*} arg - argument to check
 * @param {function} stub - function to return, if arg is not a function
 * @returns arg, if it is a function, if not - returns stub instead
 */
export function checkFunctionArgument(arg, stub = ((() => { }))) {
    return (typeof (arg) == 'function' && arg) || stub;
};

/**
 * Checks if arg is a number
 * @param {*} arg - argument to check
 * @param {number} stub - number to return, if arg is not a number
 * @returns arg, if it is a number, if not - returns stub instead
 */
export function checkNumberArgument(arg, stub = 0) {
    if (typeof (+arg) == 'number')
        return arg; 
    return stub;
}

export default class Timer {

    /**
     * Represents countdon timer
     * @param {number} time - time to countdown (seconds)
     * @param {function} onTick - function that will be executed every tick (also receives time as an argument)
     * @param {function} onStop - function that will be executed when time runs out
     */
    constructor(time, onTick, onStop) {

        /**
         * remaining time in seconds
         */
        this._time = checkNumberArgument(time, 60);

        /**
         * function that will be executed every tick
         * 
         * also gets current remaining time as an argument
         */
        this._onTick = checkFunctionArgument(onTick);

        /**
         * function that will be executed when time runs out
         */
        this._onStop = checkFunctionArgument(onStop);

        this._timer = null;
    }

    /**
     * Sets new remaining time
     * @param {number} value - new time value in seconds
     */
    setTime(value) {
        this._time = checkNumberArgument(value, this._time);
    }

    /**
     * Returns remaining time
     * @returns remianing time (seconds)
     */
    getTime() {
        return this._time;
    }

    /**
     * Sets new onTick function
     * @param {function} func - new onTick function
     */
    setOnTick(func) {
        this._onTick = checkFunctionArgument(func, this.onTick);
    }

    /**
     * Sets new onStop function
     * @param {function} func - new onStop function
     */
    setOnStop(func) {
        this._onStop = checkFunctionArgument(func, this._onStop);
    }

    /**
     * Starts timer
     */
    start() {
        let self = this;

        function tick() {
            if (self._time <= 0) {
                self.stop();
                self._onStop();
            }
            else {
                self._time--;
                self._onTick(self._time);
            }
            console.log(self._time);
        }

        this.stop();

        this._timer = setInterval(tick, 1000);
    }

    /**
     * Stops timer
     */
    stop() {
        clearInterval(this._timer);
    }
}