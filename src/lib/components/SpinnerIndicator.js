import React from "react";
import PropTypes from "prop-types";

import "../styles/indicatorStyle.css"

/**
 * A resuable spinner typing indicator
*/
const TypingIndicatorSpinner = ({ size, color }) => {
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


TypingIndicatorSpinner.defaultProps = {
    size: 20,
    color: "gray",
};

export default TypingIndicatorSpinner;
