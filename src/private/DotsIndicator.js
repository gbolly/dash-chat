import React from "react";
import PropTypes from "prop-types";

import "../styles/indicatorStyle.css"

/**
 * A resuable dots typing indicator
*/

const TypingIndicatorDots = ({ color }) => {
    return (
        <div className="typing-dots" style={{ color }}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

TypingIndicatorDots.propTypes = {
    /**
     * Color of the dots
    */
    color: PropTypes.string,
};

TypingIndicatorDots.defaultProps = {
    color: "gray",
};

export default TypingIndicatorDots;