import clsx from 'clsx';
import './timer.sass';


export default function Timer(props) {
    return (
        <div className="timer">
            <div className="info">
                <div className="info__state">
                    cycle #{props.cycle}&nbsp;&mdash; {props.phase}
                </div>
                <div className="info__prompt">
                    time left
                </div>
            </div>
            <div className="time">
                <div className="time__hours">
                    <span style={{ display: clsx(props.hours > 9 && 'none') }}>0</span>
                    {props.hours}
                </div>
                :
                <div className="time__minutes">
                    <span style={{ display: clsx(props.minutes > 9 && 'none') }}>0</span>
                    {props.minutes}
                </div>
                :
                <div className="time__seconds">
                    <span style={{ display: clsx(props.seconds > 9 && 'none') }}>0</span>
                    {props.seconds}
                </div>
            </div>
        </div>
    );
}