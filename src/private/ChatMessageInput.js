/**
 * Example Usage:
 * ```
 * <MessageInput
 *     onSend={handleSend}
 *     handleInputChange={handleInput}
 *     value={messageValue}
 *     placeholder="Type your message here"
 *     buttonLabel="Send"
 *     customStyles={{ backgroundColor: "#f0f0f0" }}
 *     inputComponentStyles={{ padding: "10px" }}
 * />
 * ```
*/

import React from "react";
import PropTypes from "prop-types";

/**
 * A reusable message input component for chat interfaces.
*/

const MessageInput = ({
    onSend,
    handleInputChange,
    value,
    placeholder = "Start typing...",
    buttonLabel = "Send",
    customStyles = null,
    inputComponentStyles = null,
    showTyping = false,
}) => {
    return (
        <div className="message-input-container" style={customStyles}>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !showTyping){
                        onSend();
                    }
                }}
                style={inputComponentStyles}
                className="message-input-field"
            />
            <button
                onClick={onSend}
                className={`message-input-button ${showTyping ? 'disabled' : ''}`}
                data-testid="send-button"
                disabled={showTyping}
            >
                {buttonLabel}
            </button>
        </div>
    );
};

MessageInput.propTypes = {
    /**
     * Callback to send the current message. Triggered on button click or pressing "Enter".
    */
    onSend: PropTypes.func.isRequired,
    /**
     * Callback to handle input field changes.
    */
    handleInputChange: PropTypes.func.isRequired,
    /**
     * The current value of the input field.
    */
    value: PropTypes.string,
    /**
     * Placeholder text for the input field. Default is `"Start typing..."`.
    */
    placeholder: PropTypes.string,
    /**
     * Label for the send button. Default is `"Send"`.
    */
    buttonLabel: PropTypes.string,
    /**
     * Inline styles for the container holding the input and button.
    */
    customStyles: PropTypes.object,
    /**
     * Inline styles for the input field.
    */
    inputComponentStyles: PropTypes.object,
    /**
     * Disable button when waiting for message.
    */
    showTyping: PropTypes.bool,
};

export default MessageInput;
