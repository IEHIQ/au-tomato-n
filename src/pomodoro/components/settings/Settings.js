import SettingsItem from "./settings-item/SettingsItem";
import cross from '../../../pics/close-icon.svg';
import './settings.sass';
import { checkAndCallFunction } from "../../modules/checkUtils";

export default function Settings(props) {

    function handleClose() {
        checkAndCallFunction(props.onClose);
    }

    function handleWorkTimeChange(value) {
        checkAndCallFunction(props.onWorkTimeChange, value);
    }

    function handleBreakTimeChange(value) {
        checkAndCallFunction(props.onBreakTimeChange, value);
    }

    function handleRestTimeChange(value) {
        checkAndCallFunction(props.onRestTimeChange, value);
    }

    function handleRestPeriodicityChange(value) {
        checkAndCallFunction(props.onRestPeriodicityChange, value);
    }

    return (
        <div
            className="settings"
        >
            <header>
                <p>settings</p>
                <button onClick={handleClose}>
                    <img src={cross}/>
                </button>
            </header>

            <main>
                <SettingsItem
                    prompt={'work time (mins)'}
                    value={props.workTime}
                    onChange={handleWorkTimeChange}
                />
                <SettingsItem
                    prompt={'break time (mins)'}
                    value={props.breakTime}
                    onChange={handleBreakTimeChange}
                />
                <SettingsItem
                    prompt={'rest time (mins)'}
                    value={props.restTime}
                    onChange={handleRestTimeChange}
                />
                <SettingsItem
                    prompt={'rest periodicity (phases)'}
                    max={100}
                    value={props.restPeriodicity}
                    onChange={handleRestPeriodicityChange}
                />
            </main>

            <footer className="message">
                <p>
                    settings will be&nbsp;applied automatically, as&nbsp;soon as&nbsp;you close this menu
                </p>
            </footer>
        </div>
    );
}