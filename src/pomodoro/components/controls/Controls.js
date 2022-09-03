import clsx from "clsx";
import { checkAndCallFunction } from "../../modules/checkUtils";
import './controls.sass';

export default function Controls(props) {

    function handleStart() {
        checkAndCallFunction(props.onStart);
    }

    function handleStop() {
        checkAndCallFunction(props.onStop);
    }

    function handlePause() {
        checkAndCallFunction(props.onPause);
    }
    
    return (
        <div className="controls">
            <div
                className="controls-group"
                style={{ display: clsx(props.status !== 0 && 'none') }}
            >
                <button
                    className="controls-group__button"
                    onClick={handleStart}
                >
                    start
                </button>
            </div>
            <div
                className="controls-group"
                style={{ display: clsx(props.status !== 1 && 'none') }}
            >
                <button
                    className="controls-group__button"
                    onClick={handleStop}
                >
                    stop
                </button>
                <button
                    className="controls-group__button"
                    onClick={handlePause}
                >
                    pause
                </button>
            </div>
            <div
                className="controls-group"
                style={{ display: clsx(props.status !== 2 && 'none') }}
            >
                <button
                    className="controls-group__button"
                    onClick={handleStop}
                >
                    stop
                </button>
                <button
                    className="controls-group__button"
                    onClick={handleStart}
                >
                    resume
                </button>
            </div>
        </div>
    );
}