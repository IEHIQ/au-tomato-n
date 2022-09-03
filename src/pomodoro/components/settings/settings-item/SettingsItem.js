import React from "react";
import './settings-item.sass';

function SettingsItem(props) {

    const min = props.min || 1;
    const max = props.max || 1440;

    function handleChange(e) {
        if (props.onChange)
            props.onChange(e.target.value);
    }

    function handleBlur(e) {
        if (e.target.value < min) {
            if (props.onChange)
                props.onChange(min);
        }
        if (e.target.value > max) {
            if (props.onChange)
                props.onChange(max);
        }
    }

    return (
        <div className="settings-item">
            <label>{props.prompt || 'item'}</label>
            <input
                type='number'
                min={min}
                max={max}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={''}
                value={props.value}
            />
        </div>
    );
}

export default SettingsItem;