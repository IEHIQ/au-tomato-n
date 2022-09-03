import gear from '../../../pics/gear-icon.svg';
import { checkAndCallFunction } from '../../modules/checkUtils';
import './titlebar.sass';

export default function Titlebar(props) {

    function handleOpen() {
        checkAndCallFunction(props.onOpen);
    }

    return (
        <div className="titlebar">
            <div className="title">
                <p className="title__main">au-tomato-n</p>
                <p className="title__sub">a pomodoro timer</p>
            </div>

            <button onClick={handleOpen}>
                <img src={gear}/>
            </button>
        </div>
    );
}