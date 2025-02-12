import React from "react";
import PropTypes from "prop-types";

import "../styles/indicatorStyle.css"

/**
 * A resuable spinner typing indicator
*/
const SPINNER_SIZE = 20;

const TypingIndicatorSpinner = ({ size = SPINNER_SIZE, color = "gray" }) => {
    return (
        <div
            className="typing-spinner"
            style={{
                width: size,
                height: size,
                borderColor: color,
                borderTopColor: "transparent",
            }}
        ></div>
    );
};

TypingIndicatorSpinner.propTypes = {
    /**
     * size of the spinner
    */
    size: PropTypes.number,
    /**
     * Color of the spinner
    */
    color: PropTypes.string,
};

export default TypingIndicatorSpinner;
