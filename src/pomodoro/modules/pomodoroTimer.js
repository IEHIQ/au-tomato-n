import { checkFunctionArgument, checkNumberArgument } from "./checkUtils.js";
import Timer from "./timer.js";

export default class PomodoroTimer {
    /**
     * Represents pomodoro-technique timer
     */
    constructor() {
        this._settings = {
            workTime: 25,
            breakTime: 5,
            restTime: 30,
            restPeriodicity: 3
        };

        this._state = {
            cycle: 0,
            phase: 0
        };

        this._time = this._settings.workTime * 60;

        this._detailedTime = {
            h: Math.floor(this._time / 3600),
            m: Math.floor(this._time % 3600 / 60),
            s: Math.floor(this._time % 3600 % 60)
        };

        this._events = {
            onTick: ((time) => { console.log(`Tick : ${time}`); }),

            onPhaseChange: ((phase) => { console.log(`Phase changed : ${phase}`); }),
            onCycleChange: ((cycle) => { console.log(`Cycle changed : ${cycle}`); }),

            onSecondsChange: ((seconds) => { console.log(`Seconds changed : ${seconds}`); }),
            onMinutesChange: ((minutes) => { console.log(`Minutes changed : ${minutes}`); }),
            onHoursChange: ((hours) => { console.log(`Hours changed : ${hours}`); }),

            onWork: (() => { console.log(`Work phase began`); }),
            onBreak: (() => { console.log(`Break phase began`); }),
            onRest: (() => { console.log(`Rest phase began`); }),

            onSave: ((data) => { console.log(`Data saved :`, data); }),
            onLoad: ((data) => { console.log(`Data loaded :`, data); }),
            onClear: ((data) => { console.log(`Data cleared :`, data); }),

            onStop: (() => { console.log(`Pomodoro stopped`); })
        }

        this._timer = new Timer(this._settings.workTime * 60);
    }

    /**
     * Returns current phase remaining time in {h: <hours>, m: <minutes>, s: <seconds>} format
     * @returns time object in {h: <hours>, m: <minutes>, s: <seconds>} format
     */
    getDetailedTime() {
        return this._detailedTime;
    }

    /**
     * refreshes detailed time 
     */
    _refreshDetailedTime() {
        this._detailedTime = {
            h: Math.floor(this._time / 3600),
            m: Math.floor(this._time % 3600 / 60),
            s: Math.floor(this._time % 3600 % 60)
        };

        this._events.onHoursChange(this._detailedTime.h);
        this._events.onMinutesChange(this._detailedTime.m);
        this._events.onSecondsChange(this._detailedTime.s);
    }

    /**
     * Returns timer state (cycle and phase)
     * @returns timer state object
     */
    getState() {
        return this._state;
    }

    /**
     * Sets new timer state (cycle and phase)
     * @param {object} state - new state
     */
    setState(state) {
        this._state = (state && {
            cycle: checkNumberArgument(state.cycle, this._state.cycle),
            phase: checkNumberArgument(state.phase, this._state.phase)
        });
        this._events.onCycleChange(this._state.cycle);
        this._events.onPhaseChange(this._state.phase);
    }

    /**
     * Returns timer settings
     * @returns timer settings object
     */
    getSettings() {
        return this._settings;
    }

    /**
     * Sets new timer settings
     * @param {object} settings - new settings 
     */
    setSettings(settings) {
        this._settings = settings && {
            workTime: checkNumberArgument(settings.workTime, this._settings.workTime),
            breakTime: checkNumberArgument(settings.breakTime, this._settings.breakTime),
            restTime: checkNumberArgument(settings.restTime, this._settings.restTime),
            restPeriodicity: checkNumberArgument(settings.restPeriodicity, this._settings.restPeriodicity)
        };
    }

    /**
     * Sets timer events
     * @param {object} events - object with event/s 
     */
    setEvents(events) {
        this._events = events && {
            onTick: checkFunctionArgument(events.onTick, this._events.onTick),

            onPhaseChange: checkFunctionArgument(events.onPhaseChange, this._events.onPhaseChange),
            onCycleChange: checkFunctionArgument(events.onCycleChange, this._events.onCycleChange),

            onSecondsChange: checkFunctionArgument(events.onSecondsChange, this._events.onSecondsChange),
            onMinutesChange: checkFunctionArgument(events.onMinutesChange, this._events.onMinutesChange),
            onHoursChange: checkFunctionArgument(events.onHoursChange, this._events.onHoursChange),

            onWork: checkFunctionArgument(events.onWork, this._events.onWork),
            onBreak: checkFunctionArgument(events.onBreak, this._events.onBreak),
            onRest: checkFunctionArgument(events.onRest, this._events.onRest),

            onSave: checkFunctionArgument(events.onSave, this._events.onSave),
            onLoad: checkFunctionArgument(events.onLoad, this._events.onLoad),
            onClear: checkFunctionArgument(events.onClear, this._events.onClear),

            onPomodoroStop: checkFunctionArgument(events.onPomodoroStop, this._events.onPomodoroStop)
        }
    }

    /**
     * Sets new remaining time for a phase
     * @param {number} time - new remaining time in seconds 
     */
    setTime(time) {
        this._time = checkNumberArgument(time, this._time);
        this._events.onTick(this._time);
        this._refreshDetailedTime();

        this._timer._time = this._time;
    }

    /**
     * Resets remaining time to work phase according to settings
     */
    resetTime() {
        this._time = this._settings.workTime * 60;
        this._events.onTick(this._time);
        this._refreshDetailedTime();

        this._timer._time = this._time;
    }

    /**
     * Resets whole timer according to settings
     */
    reset() {
        this._state.cycle = 0;
        this._state.phase = 0;

        this._events.onCycleChange(this._state.cycle);
        this._events.onPhaseChange(this._state.phase);

        this.resetTime();
    }

    /**
     * function that will be executed on every timer tick
     */
    _tick() {
        this._time = this._timer._time;
        this._events.onTick(this._time);

        if (this._detailedTime.s === 0) {
            if (this._detailedTime.m === 0) {
                if (this._detailedTime.h > 0) {

                    this._detailedTime.h--;
                    this._detailedTime.m = 59;
                    this._detailedTime.s = 59;

                    this._events.onHoursChange(this._detailedTime.h);
                    this._events.onMinutesChange(this._detailedTime.m);
                    this._events.onSecondsChange(this._detailedTime.s);
                }
            }
            else {
                this._detailedTime.m--;
                this._detailedTime.s = 59;

                this._events.onMinutesChange(this._detailedTime.m);
                this._events.onSecondsChange(this._detailedTime.s);
            }
        }
        else {
            this._detailedTime.s--;

            this._events.onSecondsChange(this._detailedTime.s);
        }
    }

    /**
     * function that will be executed every time when phase is changing
     */ 
    _handlePhaseSwitch() {
        // work/break phase switched
        this._state.phase = (this._state.phase + 1) % 2;

        // if cycle switched
        if (this._state.phase === 0) {
            // setting new cycle 
            this._state.cycle++;

            // setting work time
            this._time = this._settings.workTime * 60;

            this._events.onCycleChange(this._state.cycle);
            this._events.onWork();
        }
        // cycle not switched
        else {
            // next break is long (rest)
            if (this._state.cycle > 0 && this._state.cycle % this._settings.restPeriodicity === 0) {
                this._time = this._settings.restTime * 60;
                this._events.onRest();
            }
            // normal break
            else {
                this._time = this._settings.breakTime * 60;
                this._events.onBreak();
            }
        }

        this._refreshDetailedTime();
        this._events.onTick(this._time);

        // switching phase
        this._events.onPhaseChange(this._state.phase);

        this._timer.setTime(this._time);
        
        // restarting timer
        this._timer.start();
    }

    /**
     * Starts timer
     */
    start() {
        this._timer.setEvents({
            onTick: this._tick.bind(this),
            onStop: this._handlePhaseSwitch.bind(this)
        });

        // report initial time before start
        this._events.onTick(this._time);

        this._events.onHoursChange(this._detailedTime.h);
        this._events.onMinutesChange(this._detailedTime.m);
        this._events.onSecondsChange(this._detailedTime.s);

        this._events.onCycleChange(this._state.cycle);
        this._events.onPhaseChange(this._state.phase);

        // start
        this._timer.start();
    }

    /**
     * Stops pomodoro timer
     */
    stop() {
        this._timer.stop();
    }

    /**
     * Saves time, state and settings into localStorage
     * @returns object with saved time, state and settings objects
     */
    saveData() {
        window.localStorage.setItem("time", JSON.stringify(this._time));
        window.localStorage.setItem("state", JSON.stringify(this._state));
        window.localStorage.setItem("settings", JSON.stringify(this._settings));

        this._events.onSave({
            time: this._time,
            state: this._state,
            settings: this._settings
        });
    }

    /**
     * Tries to load timer state and settings from localStorage
     * @returns array with loaded values or null if load error occured
     */
    loadData() {
        let time;
        let state;
        let settings;

        time = window.localStorage.getItem("time");
        state = window.localStorage.getItem("state");
        settings = window.localStorage.getItem("settings");

        try {
            time = time && JSON.parse(time);
            state = state && JSON.parse(state);
            settings = settings && JSON.parse(settings);

        } catch (error) {
            console.log(error.message);
            return null;
        }

        this.setTime(time);
        this.setState(state);
        this.setSettings(settings);

        this._events.onLoad({
            time: time,
            state: state,
            settings: settings
        });

        return [time, state, settings];
    }

    /**
     * Clears localStorage
     */
    clearData() {
        window.localStorage.clear();

        this._events.onClear({
            time: this._time,
            state: this._state,
            settings: this._settings
        });
    }
}