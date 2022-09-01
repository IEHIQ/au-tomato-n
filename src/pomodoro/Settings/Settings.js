import { useEffect, useRef, useState } from "react";
import SettingsInput from "./SettingsInput/SettingsInput";
import './settings.sass';

export default function Settings(props) {

    const hoverRef = useRef(null);

    function handleMouseEnter(e) {
        hoverRef.current = true;
    }

    function handleMouseLeave(e) {
        hoverRef.current = false;
    }

    function handleClick(e) {
        if (!hoverRef.current) {
            if (props.onOutsideClick)
                props.onOutsideClick();
        }
    }

    function callFuncIfExists(func, value) {
        typeof (func) == 'function' && func(value);
    }

    useEffect(() => {
        hoverRef.current = false;
        document.addEventListener('mousedown', handleClick);
    }, []);

    return (
        <section
            className="settings"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="item">
                <div className="item__name">work time</div>
                <SettingsInput
                    onChange={(value) => { callFuncIfExists(props.onWorkTimeChange, value) }}
                />
            </div>
            <div className="item">
                <div className="item__name">break time</div>
                <SettingsInput 
                    onChange={(value) => { callFuncIfExists(props.onBreakTimeChange, value) }}
                />
            </div>
            <div className="item">
                <div className="item__name">rest time</div>
                <SettingsInput 
                    onChange={(value) => { callFuncIfExists(props.onRestTimeChange, value) }}
                />
            </div>
            <div className="item">
                <div className="item__name">rest periodicity</div>
                <SettingsInput 
                    onChange={(value) => { callFuncIfExists(props.onRestPeriodicityChange, value) }}
                />
            </div>
        </section>
    );
}