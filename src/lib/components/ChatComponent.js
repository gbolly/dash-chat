/**
 * Example Usage:
 * ```
 * <ChatComponent
 *     id="chat"
 *     messages={[
 *         { sender: "assistant", text: "Hello! How can I assist you today?" }
 *     ]}
 *     typingIndicator="dots"
 *     theme="darkTheme"
 *     customStyles={{ backgroundColor: "#222", color: "#fff" }}
 *     isTyping={{ user: false, assistant: true }}
 * />
 * ```
*/

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import MessageInput from "./ChatMessageInput";
import TypingIndicatorDots from "./DotsIndicator";
import TypingIndicatorSpinner from "./SpinnerIndicator";

import "../styles/chatStyles1.css";
import "../styles/chatStyles2.css";

/**
 * ChatComponent - A React-based chat interface with customizable styles and typing indicators.
 * * This component provides a chat interface with support for:
 * - Displaying messages exchanged between 2 users typically a user and an assistant.
 * - Customizable themes and styles for the chat UI.
 * - Typing indicators for both the user and assistant.
 * - Integration with Dash via the `setProps` callback for state management.
*/

const ChatComponent = ({
    messages: propMessages,
    theme,
    customStyles,
    typingIndicator,
    inputComponent: CustomInputComponent,
    messageInputContainerStyle,
    messageInputStyle,
    setProps,
    isTyping
}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [localMessages, setLocalMessages] = useState(propMessages || []);
    const messageEndRef = useRef(null);

    useEffect(() => {
        setLocalMessages(propMessages || []);
    }, [propMessages]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [localMessages, isTyping]);

    const handleInputChange = (e) => {
        setCurrentMessage(e.target.value);
        if (setProps) {
            setProps({ isTyping: { user: e.target.value.length > 0, assistant: isTyping?.assistant } });
        }
    };

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = { sender: "user", text: currentMessage };
            setLocalMessages((prevMessages) => [...prevMessages, newMessage]);

            if (setProps) {
                setProps({ newMessage, isTyping: { user: false, assistant: !isTyping?.assistant } });
            }

            setCurrentMessage("");
        }
    };

    return (
        <div className={`chat-container ${theme === "darkTheme" ? "default2" : "default1"}`} style={customStyles}>
            <div className="chat-messages">
                {localMessages.map((message, index) => (
                    <div key={index} className={`chat-bubble ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
                {isTyping?.user && (
                    <div className="typing-indicator user-typing">
                        {typingIndicator === "dots" && <TypingIndicatorDots />}
                        {typingIndicator === "spinner" && <TypingIndicatorSpinner />}
                    </div>
                )}
                {isTyping?.assistant && (
                    <div className="typing-indicator assistant-typing">
                        {typingIndicator === "dots" && <TypingIndicatorDots />}
                        {typingIndicator === "spinner" && <TypingIndicatorSpinner />}
                    </div>
                )}
                <div ref={messageEndRef} />
            </div>
            <div className="chat-input">
                {CustomInputComponent ? (
                    <CustomInputComponent onSend={handleSendMessage} />
                ) : (
                    <MessageInput
                        onSend={handleSendMessage}
                        handleInputChange={handleInputChange}
                        value={currentMessage}
                        customStyles={messageInputContainerStyle}
                        inputComponentStyles={messageInputStyle}
                    />
                )}
            </div>
        </div>
    );
};

ChatComponent.propTypes = {
    /**
     * The ID of this component, used to identify dash components
     * in callbacks. The ID needs to be unique across all of the
     * components in an app.
    */
    id: PropTypes.string,
    /**
     * An array of options. The list of chat messages. Each message object should have:
     *    - `sender` (string): The message sender, either "user" or "assistant".
     *    - `text` (string): The content of the message.
    */
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            sender: PropTypes.oneOf(["user", "assistant"]),
            text: PropTypes.string.isRequired,
        })
    ),
    /**
     * Dash-assigned callback that gets fired when the value for messages and isTyping changes.
    */
    setProps: PropTypes.func,
    /**
     * Theme for the chat interface. Default is "lightTheme". Use "darkTheme" for a dark mode appearance.
    */
    theme: PropTypes.string,
    /**
     * Inline styles to customize the chat container.
    */
    customStyles: PropTypes.object,
    /**
     * The type of typing indicator to display. Options are:
     *    - `"dots"`: Displays animated dots.
     *    - `"spinner"`: Displays a spinner animation.
    */
    typingIndicator: PropTypes.oneOf(["dots", "spinner"]),
    /**
     * A custom message React input component. If provided, it will override the default input field.
    */
    inputComponent: PropTypes.elementType,
    /**
     * Latest chat message that was appended to messages array.
    */
    newMessage: PropTypes.object,
    /**
     * Inline styles for the container holding the message input field.
    */
    messageInputContainerStyle: PropTypes.object,
    /**
     * Inline styles for the message input field itself.
    */
    messageInputStyle: PropTypes.object,
    /**
     * Indicates whether the user or assistant is typing. Should be an object with:
     *    - `user` (boolean): True if the user is typing.
     *    - `assistant` (boolean): True if the assistant is typing.
    */
    isTyping: PropTypes.shape({
        user: PropTypes.bool,
        assistant: PropTypes.bool,
    }),
};

ChatComponent.defaultProps = {
    setProps: () => {},
    theme: "lightTheme",
    customStyles: null,
    typingIndicator: "dots",
    inputComponent: null,
    newMessage: null,
    messageInputContainerStyle: null,
    messageInputStyle: null,
    isTyping: { user: false, assistant: false },
};

export default ChatComponent;
