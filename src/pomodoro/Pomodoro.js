import { useEffect, useRef, useState } from "react";
import blip from '../sounds/blip.wav';
import './pomodoro.sass';
import clsx from "clsx";
import Settings from "./components/settings/Settings";
import Controls from "./components/controls/Controls";
import Titlebar from "./components/titlebar/Titlebar";
import Timer from "./components/timer/Timer";
import PomodoroTimer from "./modules/pomodoroTimer";
import Popup from "./components/popup/Popup";

const PHASES = ['work', 'break', 'rest'];

export default function Pomodoro(props) {

    const pomodoroRef = useRef(null);
    const settingsRef = useRef(null);
    const audioRef = useRef(null);

    const [settingsOpen, setSettingsOpen] = useState(false);

    // 0 - stopped, 1 - running, 2 - paused
    const [timerStatus, setTimerStatus] = useState(0);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [restTime, setRestTime] = useState(25);
    const [restPeriodicity, setRestPeriodicity] = useState(3);

    const [cycle, setCycle] = useState(0);
    const [phase, setPhase] = useState(0);

    const [message, setMessage] = useState('');
    const [messageShowing, setMessageShowing] = useState(false);

    function showMessage(message) {
        setMessage(message);
        setMessageShowing(true);
        setTimeout(() => { setMessageShowing(false) }, 5000);
    }

    function refreshSettings() {
        setWorkTime(settingsRef.current.workTime);
        setBreakTime(settingsRef.current.breakTime);
        setRestTime(settingsRef.current.restTime);
        setRestPeriodicity(settingsRef.current.restPeriodicity);
    }

    //--

    function openSettings() {
        setSettingsOpen(true);
    }

    function closeSettings() {
        applySettings();
        setSettingsOpen(false);
    }

    //--

    function handleStart() {
        setTimerStatus(1);

        pomodoroRef.current.start();
    }

    function handleStop() {
        setTimerStatus(0);

        pomodoroRef.current.stop();
        pomodoroRef.current.reset();
    }

    function handlePause() {
        setTimerStatus(2);

        pomodoroRef.current.stop();
    }

    //--

    function handleWorkTimeChange(value) {
        setWorkTime(value);
        settingsRef.current.workTime = +value;
    }

    function handleBreakTimeChange(value) {
        setBreakTime(value);
        settingsRef.current.breakTime = +value;
    }

    function handleRestTimeChange(value) {
        setRestTime(value);
        settingsRef.current.restTime = +value;
    }

    function handleRestPeriodicityChange(value) {
        setRestPeriodicity(value);
        settingsRef.current.restPeriodicity = +value;
    }

    //--

    function handleCycleChange(cycle) {
        setCycle(cycle);
    }

    function handlePhaseChange(phase) {
        setPhase(phase + +(cycle > 0 && cycle % restPeriodicity === 0));
    }

    function handleWork() {
        audioRef.current.play();

        showMessage('time to work');
    }

    function handleBreak() {
        audioRef.current.play();

        showMessage('take a break');
    }

    function handleRest() {
        audioRef.current.play();

        showMessage('take some rest');
    }

    //--

    function handleHoursChange(hours) {
        setHours(hours);
    }

    function handleMinutesChange(minutes) {
        setMinutes(minutes);
    }

    function handleSecondsChange(seconds) {
        setSeconds(seconds);
    }

    //--

    function handleLoad() {
        setTimerStatus(2);
        showMessage('last timer state was loaded');
    }

    function applySettings() {
        pomodoroRef.current.setSettings(settingsRef.current);

        if (timerStatus === 0) {
            pomodoroRef.current.reset();
        }
    }

    useEffect(() => {
        pomodoroRef.current = new PomodoroTimer();

        let events = {
            onCycleChange: handleCycleChange,
            onPhaseChange: handlePhaseChange,

            onSecondsChange: handleSecondsChange,
            onMinutesChange: handleMinutesChange,
            onHoursChange: handleHoursChange,

            onWork: handleWork,
            onBreak: handleBreak,
            onRest: handleRest,

            onLoad: handleLoad
        }

        pomodoroRef.current.setEvents(events);

        pomodoroRef.current.loadData();

        console.log(pomodoroRef.current);

        audioRef.current = new Audio(blip);

        settingsRef.current = pomodoroRef.current.getSettings();

        refreshSettings();

        window.addEventListener('unload', () => {
            pomodoroRef.current.saveData();
        });

        return () => {
            pomodoroRef.current.stop();
        }

    }, []);

    return (
        <main className="pomodoro-app">
            <header>
                <Titlebar
                    onOpen={openSettings}
                />
            </header>

            <section>
                <Timer
                    cycle={cycle}
                    phase={PHASES[phase]}
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                />
            </section>

            <footer>
                <Popup
                    showing={messageShowing}
                    message={message}
                />
                <Controls
                    onStart={handleStart}
                    onStop={handleStop}
                    onPause={handlePause}
                    status={timerStatus}
                />
            </footer>


            <aside className={clsx(settingsOpen ? "opened" : "closed")}>
                <Settings
                    workTime={workTime}
                    breakTime={breakTime}
                    restTime={restTime}
                    restPeriodicity={restPeriodicity}

                    onClose={closeSettings}

                    onWorkTimeChange={handleWorkTimeChange}
                    onBreakTimeChange={handleBreakTimeChange}
                    onRestTimeChange={handleRestTimeChange}
                    onRestPeriodicityChange={handleRestPeriodicityChange}
                />
            </aside>
        </main>
    );
}