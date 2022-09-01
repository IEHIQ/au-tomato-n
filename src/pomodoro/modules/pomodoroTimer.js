import Timer, { checkFunctionArgument } from "./timer.js";
import { checkNumberArgument } from "./timer.js";

export default class PomodoroTimer {
    /**
     * Represents pomodoro timer
     * @param {object} settings - pomodoro settings
     * @param {object} state - pomodoro timer state
     * @param {object} events - object with various events that timer will fire accordingly
     */
    constructor(settings, state, events) {
        this._settings = (settings && {
            workTime: checkNumberArgument(settings.workTime, 25),
            breakTime: checkNumberArgument(settings.breakTime, 5),
            restTime: checkNumberArgument(settings.restTime, 25), // long break basically
            restPeriodicity: checkNumberArgument(settings.restPeriodicity, 3)
        }) || {
            workTime: 25,
            breakTime: 5,
            restTime: 25,
            restPeriodicity: 3
        }

        /**
         * Pomodoro-timer state
         */
        this._state = (state && {
            /**
             * seconds left in current phase
             */
            time: checkNumberArgument(state.time, this._settings.workTime),
            /**
             * current work/rest cycle
             */
            cycle: checkNumberArgument(state.cycle, 0),
            /**
             * current phase (work or rest)
             */
            phase: checkNumberArgument(state.phase, 0)
        }) || {
            time: this._settings.workTime,
            cycle: 0,
            phase: 0
        }

        this._detailedTime = {
            h: Math.floor(this._state.time / 3600),
            m: Math.floor(this._state.time % 3600 / 60),
            s: Math.floor(this._state.time % 3600 % 60)
        }

        /**
         * events that will be firing
         */
        this._events = (events && {
            /**
             * executes every timer tick
             * 
             * gets new time value as an argument
             */
            onTick: checkFunctionArgument(events.onTick),
            /**
             * executes on phase switch
             * 
             * gets new phase value as an argument
             */
            onPhaseSwitch: checkFunctionArgument(events.onPhaseSwitch),
            /**
             * executes on cycle switch
             * 
             * gets new cycle value as an argument
             */
            onCycleSwitch: checkFunctionArgument(events.onCycleSwitch),
            /**
             * executes every second
             * 
             * gets new seconds value from _detailedTime as an argument
             */
            onSecondTick: checkFunctionArgument(events.onSecondTick),
            /**
             * executes every minute
             * 
             * gets new minutes value from _detailedTime as an argument
             */
            onMinuteTick: checkFunctionArgument(events.onMinuteTick),
            /**
             * executes every hour
             * 
             * gets new hours value from _detailedTime as an argument
             */
            onHourTick: checkFunctionArgument(events.onHourTick),
            /**
             * executes on work phase beginning
             */
            onWork: checkFunctionArgument(events.onWork),
            /**
             * executes on break phase beginning
             */
            onBreak: checkFunctionArgument(events.onBreak),
            /**
             * executes on rest phase beginning
             */
            onRest: checkFunctionArgument(events.onRest),
            /**
             * executes on timer stop
             */
            onStop: checkFunctionArgument(events.onStop)
        }) || {
            onTick: (() => { }),
            onPhaseSwitch: (() => { }),
            onCycleSwitch: (() => { }),
            onSecondTick: (() => { }),
            onMinuteTick: (() => { }),
            onHourTick: (() => { }),
            onWork: (() => { }),
            onBreak: (() => { }),
            onRest: (() => { }),
            onStop: (() => { })
        };

        /**
         * countdown timer
         * 
         * gets reset on every new phase
         */
        this._timer = new Timer(this._state.time);
    }


    /**
     * Returns remained time of current phase in seconds
     */
    getTime() {
        return this._state.time;
    }

    /**
     * Returns remained time of current phase in {h : <hours left>, m: <minutes left>, s: <seconds left>} format
     */
    getDetailedTime() {
        return this._detailedTime;
    }

    /**
     * Returns timer state
     */
    getState() {
        return this._state;
    }

    /**
     * resets _detailedTime
     */
    _resetDetailedTime() {
        // resetting detailed time
        this._detailedTime = {
            h: Math.floor(this._state.time / 3600),
            m: Math.floor(this._state.time % 3600 / 60),
            s: Math.floor(this._state.time % 3600 % 60)
        };
    }

    /**
     * Sets new state
     * @param {object} newState - new state 
     */
    setState(newState) {
        this._state = (newState && {
            time: checkNumberArgument(newState.time, this._state.time),
            cycle: checkNumberArgument(newState.cycle, this._state.cycle),
            phase: checkNumberArgument(newState.phase, this._state.phase)
        });
        this._resetDetailedTime();
        this._timer.setTime(this._state.time);
    }

    /**
     * Returns pomodoro settings
     */
    getSettings() {
        return this._settings;
    }

    /**
     * Sets new pomodoro settings
     * @param {object} newSettings - new settings 
     */
    setSettings(newSettings) {
        this._settings = newSettings && {
            workTime: checkNumberArgument(newSettings.workTime, this._settings.workTime),
            breakTime: checkNumberArgument(newSettings.breakTime, this._settings.breakTime),
            restTime: checkNumberArgument(newSettings.restTime, this._settings.restTime),
            restPeriodicity: checkNumberArgument(newSettings.restPeriodicity, this._settings.restPeriodicity)
        };
    }

    resetTimer() {
        this.stop();
        this._events.onStop();

        this._state.time = this._settings.workTime;
        this._state.cycle = 0;
        this._state.phase = 0;

        this._timer.setTime(this._state.time);
    }

    /**
     * Starts pomodoro timer
     */
    start() {

        let self = this;
        /**
         * timer tick handler
         * @param {number} time 
         */
        function _handleTick(time) {
            self._state.time = time;
            self._events.onTick(self._state.time);

            if (self._detailedTime.s === 0) {
                if (self._detailedTime.m === 0) {
                    if (self._detailedTime.h > 0) {

                        self._detailedTime.h--;
                        self._detailedTime.m = 59;
                        self._detailedTime.s = 59;

                        self._events.onHourTick(self._detailedTime.h);
                        self._events.onMinuteTick(self._detailedTime.m);
                        self._events.onSecondTick(self._detailedTime.s);
                    }
                }
                else {
                    self._detailedTime.m--;
                    self._detailedTime.s = 59;

                    self._events.onMinuteTick(self._detailedTime.m);
                    self._events.onSecondTick(self._detailedTime.s);
                }
            }
            else {
                self._detailedTime.s--;

                self._events.onSecondTick(self._detailedTime.s);
            }
        }

        function _handlePhaseSwitch() {
            // work/break phase switched
            self._state.phase = (self._state.phase + 1) % 2;

            // if cycle switched
            if (self._state.phase === 0) {
                // setting new cycle 
                self._state.cycle++;

                // setting work time
                self._state.time = self._settings.workTime * 60;
                self._timer.setTime(self._state.time);

                self._events.onCycleSwitch(self._state.cycle);
                self._events.onWork();
            }
            // cycle not switched
            else {
                // next break is long (rest)
                if (self._state.cycle > 0 && self._state.cycle % self._settings.restPeriodicity === 0) {
                    self._state.time = self._settings.restTime * 60;
                    self._timer.setTime(self._state.time);
                    self._events.onRest();
                }
                // normal break
                else {
                    self._state.time = self._settings.breakTime * 60;
                    self._timer.setTime(self._state.time);

                    self._events.onBreak();
                }
            }

            self._resetDetailedTime();
            self._events.onTick(self._state.time);
            self._events.onSecondTick(self._detailedTime.s);

            // switching phase
            self._events.onPhaseSwitch(self._state.phase);

            // restarting timer
            self._timer.start();
        }

        this._timer.setOnTick(_handleTick);
        this._timer.setOnStop(_handlePhaseSwitch);
        this._timer.start();
    }

    /**
     * Stops pomodoro timer
     */
    stop() {
        this._timer.stop();
    }

    /**
     * Saves timer state and settings into localStorage
     * @returns array with saved state and settings objects
     */
    saveData() {
        window.localStorage.setItem("state", JSON.stringify(this._state));
        window.localStorage.setItem("settings", JSON.stringify(this._settings));

        return [this._state, this._settings];
    }

    /**
     * Tries to load timer state and settings from localStorage
     * @returns array with loaded values or nulls if load error occured
     */
    loadData() {
        let state;
        let settings;

        state = window.localStorage.getItem("state");
        settings = window.localStorage.getItem("settings");

        try {
            state = state && JSON.parse(state);
            settings = settings && JSON.parse(settings);

            this.setState(state);
            this.setSettings(settings);
            this._timer.setTime(this._state.time);
        } catch (error) {
            console.log(error.message);
            return [null, null];
        }

        return [state, settings];
    }
}