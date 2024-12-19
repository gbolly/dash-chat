/**
 * Example Usage:
 * ```
 * <ChatComponent
 *     id="chat"
 *     messages={[
 *         { sender: "assistant", text: "Hello! How can I assist you today?" }
 *     ]}
 *     typing_indicator="dots"
 *     theme="dark"
 *     custom_styles={{ backgroundColor: "#222", color: "#fff" }}
 *     is_typing={{ user: false, assistant: true }}
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
    /**
     * allowing snake_case to support Python's naming convention
     * except for setProps which is automatically set by dash and
     * it's expected to be named in the camelCase format.
     * https://dash.plotly.com/react-for-python-developers
    */
    messages: propMessages,
    theme,
    container_style: containerStyle,
    typing_indicator: typingIndicator,
    input_container_style: inputContainerStyle,
    input_text_style: inputTextStyle,
    setProps,
    fill_height: fillHeight,
    fill_width: fillWidth,
}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [localMessages, setLocalMessages] = useState(propMessages || []);
    const messageEndRef = useRef(null);
    const [showTyping, setShowTyping] = useState(false);

    useEffect(() => {
        const lastMsg = propMessages.slice(-1).pop();

        if (lastMsg.sender === "assistant" && showTyping) {
            setShowTyping(false);
        }
        setLocalMessages(propMessages || []);
    }, [propMessages]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [localMessages]);

    const handleInputChange = (e) => {
        setCurrentMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = { sender: "user", text: currentMessage };
            setLocalMessages((prevMessages) => [...prevMessages, newMessage]);

            if (setProps) {
                setProps({ new_message: newMessage });
            }

            if (setProps) {
                setProps({ new_message: newMessage });
            }
            setShowTyping(true);

            setCurrentMessage("");
        }
    };

    const styleChatContainerSize = {};
    if (fillHeight) {
        styleChatContainerSize.height = "95vh";
    } else {
        styleChatContainerSize.height = "50vh";
    }
    if (fillWidth) {
        styleChatContainerSize.width = "100%";
    } else {
        styleChatContainerSize.width = "50%";
        styleChatContainerSize.margin = "0 auto";
    }

    return (
        <div className="container">
            <div
                className={`chat-container ${theme === "dark" ? "default2" : "default1"}`}
                style={{ ...containerStyle, ...styleChatContainerSize }}
            >
                <div className="chat-messages">
                    {localMessages.map((message, index) => (
                        <div key={index} className={`chat-bubble ${message.sender}`}>
                            {message.text}
                        </div>
                    ))}
                    {showTyping && (
                        <div className="typing-indicator user-typing" data-testid="typing-indicator">
                            {typingIndicator === "dots" && <TypingIndicatorDots />}
                            {typingIndicator === "spinner" && <TypingIndicatorSpinner />}
                        </div>
                    )}
                    <div ref={messageEndRef} />
                </div>
                <div className="chat-input">
                    <MessageInput
                        onSend={handleSendMessage}
                        handleInputChange={handleInputChange}
                        value={currentMessage}
                        customStyles={inputContainerStyle}
                        inputComponentStyles={inputTextStyle}
                    />
                </div>
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
     * Theme for the chat interface. Default is "light". Use "dark" for a dark mode appearance.
    */
    theme: PropTypes.string,
    /**
     * Inline css styles to customize the chat container.
    */
    container_style: PropTypes.object,
    /**
     * The type of typing indicator to display. Options are:
     *    - `"dots"`: Displays animated dots.
     *    - `"spinner"`: Displays a spinner animation.
    */
    typing_indicator: PropTypes.oneOf(["dots", "spinner"]),
    /**
     * Latest chat message that was appended to messages array.
    */
    new_message: PropTypes.object,
    /**
     * Inline styles for the container holding the message input field.
    */
    input_container_style: PropTypes.object,
    /**
     * Inline styles for the message input field itself.
    */
    input_text_style: PropTypes.object,
    /**
     *  Whether to vertically fill the screen with the chat container. If False, centers and constrains container to a maximum height.
    */
    fill_height: PropTypes.bool,
    /**
     * Whether to horizontally fill the screen with the chat container. If False, centers and constrains container to a maximum width.
    */
    fill_width: PropTypes.bool,
};

ChatComponent.defaultProps = {
    setProps: () => {},
    theme: "light",
    container_style: null,
    typing_indicator: "dots",
    new_message: null,
    input_container_style: null,
    input_text_style: null,
    fill_height: true,
    fill_width: true
};

export default ChatComponent;
