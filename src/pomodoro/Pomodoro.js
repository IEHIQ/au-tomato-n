import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import PomodoroTimer from "./modules/pomodoroTimer";
import './pomodoro.sass';
import Settings from "./Settings/Settings";

const PHASES = ['working', 'resting'];

export default function Pomodoro(props) {

    const pomodoroRef = useRef(null);

    const [settingsOpen, setSettingsOpen] = useState(false);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [cycle, setCycle] = useState(0);
    const [phase, setPhase] = useState(0);
    
    //--

    function openSettings() {
        setSettingsOpen(true);
    }

    function closeSettings() {
        setSettingsOpen(false);
    }

    //---

    function setWorkTime(value) {
        pomodoroRef.current && pomodoroRef.current.setSettings({ workTime: value });
    }

    function setBreakTime(value) {
        pomodoroRef.current && pomodoroRef.current.setSettings({ breakTime: value });
    }

    function setRestTime(value) {
        pomodoroRef.current && pomodoroRef.current.setSettings({ restTime: value });
    }

    function setRestPeriodicity(value) {
        pomodoroRef.current && pomodoroRef.current.setSettings({ restPeriodicity: value });
    }

    //---

    function onPhaseSwitch(value) {
        setPhase(value);
    }

    function onCycleSwitch(value) {
        setCycle(value);
    }

    //--

    function onHourTick(value) {
        setHours(value);
    }

    function onMinuteTick(value) {
        setMinutes(value);
    }

    function onSecondTick(value) {
        setSeconds(value);
    }

    useEffect(() => {
        let events = {
            onPhaseSwitch: onPhaseSwitch,
            onCycleSwitch: onCycleSwitch,
            onSecondTick: onSecondTick,
            onMinuteTick: onMinuteTick,
            onHourTick: onHourTick
        };

        pomodoroRef.current = new PomodoroTimer(undefined, undefined, events);

        console.log('Loaded', pomodoroRef.current.loadData());

        let state = pomodoroRef.current.getState();
        let time = pomodoroRef.current.getDetailedTime();

        console.log(time);
        console.log(state);

        setHours(time.h);
        setMinutes(time.m);
        setSeconds(time.s);

        setCycle(state.cycle);
        setPhase(state.phase);

        pomodoroRef.current.start();

        window.addEventListener('unload', function(event) {
            console.log('Saved', pomodoroRef.current.saveData());
            pomodoroRef.current.stop();
        });

        return () => {
            pomodoroRef.current.stop();
        }
    }, []);

    return (
        <main className="pomodoro-app">
            <header>
                <div className="title">
                    <div className="title__main">au-tomato-n</div>
                    <div className="title__sub">a pomodoro timer</div>
                </div>
                <div
                    className="settings-button non-selectable"
                    onClick={openSettings}
                >
                    settings
                    <div className="settings-button__slider"></div>
                </div>
            </header>
            <section className="timer">
                <div className="timer__info">
                    cycle #{cycle}&nbsp;&mdash; {PHASES[phase]}
                </div>
                <div className="time">
                    <div className="time__hours">
                        <span style={{display: clsx(hours < 10 && 'none')}}>0</span>
                        {hours}
                    </div>
                    :
                    <div className="time__minutes">
                        <span style={{display: clsx((hours === 0 || minutes > 10) && 'none')}}>0</span>
                        {minutes}
                    </div>
                    :
                    <div className="time__seconds">
                        <span style={{display: clsx(seconds < 10 && 'none')}}>0</span>
                        {seconds}
                    </div>
                </div>
            </section>
            <footer>
            </footer>

            <div
                className={clsx("pomodoro-app__settings", settingsOpen ? "open" : "closed")}
            >
                <Settings
                    onOutsideClick={closeSettings}
                    onWorkTimeChange={setWorkTime}
                    onBreakTimeChange={setBreakTime}
                    onRestTimeChange={setRestTime}
                    onRestPeriodicityChange={setRestPeriodicity}
                />
            </div>
        </main>
    );
}