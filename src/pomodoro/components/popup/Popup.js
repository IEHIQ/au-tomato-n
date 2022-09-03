import clsx from "clsx";
import './popup.sass';

export default function Popup(props) {
    return (
        <div className={clsx("popup message", props.showing === true & 'show', props.showing === false && 'hide')}>
            <div>{props.message}</div>
        </div>
    );
}