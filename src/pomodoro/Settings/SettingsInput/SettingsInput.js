import React, { useState } from "react";
import './settings-input.sass';

function SettingsInput(props) {

    const min = props.min || 1;
    const max = props.max || 1440;
    const [value, setValue] = useState(props.value || min);

    function handleChange(e) {
        setValue(e.target.value);
        if (props.onChange)
            props.onChange(e.target.value);
    }

    function handleBlur(e) {
        if (value < min) {
            setValue(min);
            if (props.onChange)
                props.onChange(min);
        }
        if (value > max) {
            setValue(max);
            if (props.onChange)
                props.onChange(max);
        }
    }

    return (
        <div className="settings-input">
            <input
                type='number'
                min={min}
                max={max}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={value}
                value={value}
            />
            <div className="settings-input__slider"></div>
        </div>
    );
}

export default SettingsInput;