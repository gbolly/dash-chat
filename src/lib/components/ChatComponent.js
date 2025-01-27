/**
 * Example Usage:
 * ```
 * <ChatComponent
 *     id="chat"
 *     messages={[
 *         { role: "assistant", content: "Hello! How can I assist you today?" }
 *     ]}
 *     typing_indicator="dots"
 *     theme="dark"
 *     custom_styles={{ backgroundColor: "#222", color: "#fff" }}
 *     is_typing={{ user: false, assistant: true }}
 * />
 * ```
*/

import React, { useEffect, useRef, useState } from "react";
import Linkify from "linkify-react";
import PropTypes from "prop-types";

import MessageInput from "../../private/ChatMessageInput";
import TypingIndicatorDots from "../../private/DotsIndicator";
import TypingIndicatorSpinner from "../../private/SpinnerIndicator";
import { bubbleStyle as sharedBubbleStyle } from "../../styles/sharedStyles";

import "../../styles/chatStyles.css";

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
    id,
    messages: propMessages,
    theme,
    container_style: containerStyle,
    typing_indicator: typingIndicator,
    input_container_style: inputContainerStyle,
    input_text_style: inputTextStyle,
    setProps,
    fill_height: fillHeight,
    fill_width: fillWidth,
    bubble_styles: bubbleStyles,
    input_placeholder: inputPlaceholder,
    class_name: className,
    persistence,
    persistence_type: persistenceType
}) => {
    const linkifyOptions = {
        className: "link-message",
        target: "_blank",
    };
    const { user: userBubbleStyle, assistant: assistantBubbleStyle } = bubbleStyles || {};
    const [currentMessage, setCurrentMessage] = useState("");
    const [localMessages, setLocalMessages] = useState(propMessages || []);
    const [showTyping, setShowTyping] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const messageEndRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (persistence) {
            const savedMessages = JSON.parse(window[persistenceType].getItem(id)) || [];
            if (savedMessages.length > 0) {
                setLocalMessages(savedMessages);
            }
        }
    }, [id, persistence, persistenceType]);
    
    useEffect(() => {
        if (persistence) {
            window[persistenceType].setItem(id, JSON.stringify(localMessages));
        }
    }, [localMessages, id, persistence, persistenceType]);

    useEffect(() => {
        if (propMessages) {
            const lastMsg = propMessages.slice(-1).pop();
            if (lastMsg?.role === "assistant" && showTyping) {
                setShowTyping(false);
            }
            setLocalMessages((prevMessages) => {
                return [...prevMessages, lastMsg]
            });
        }
    }, [propMessages]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [localMessages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    

    const handleInputChange = (e) => {
        setCurrentMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = { role: "user", content: currentMessage };
            setLocalMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage];
                if (persistence) {
                    window[persistenceType].setItem(id, JSON.stringify(updatedMessages));
                }
                return updatedMessages;
            });

            if (setProps) {
                setProps({ new_message: newMessage });
            }

            setShowTyping(true);
            setCurrentMessage("");
        }
    };

    const handleClearChat = () => {
        setLocalMessages([]);
        if (persistence) {
            window[persistenceType].removeItem(id);
        }
    };

    const styleChatContainer = {};
    const inputFieldStyle = {};
    if (fillHeight) {
        styleChatContainer.height = "100%";
    } else {
        styleChatContainer.height = "50%";
    }
    if (fillWidth) {
        styleChatContainer.width = "auto";
    } else {
        styleChatContainer.width = "50%";
        styleChatContainer.margin = "0 auto";
    }
    if (theme === "dark") {
        styleChatContainer.backgroundColor = "#161618";
        styleChatContainer.borderColor = "#444444";
        styleChatContainer.color = "#ffffff";
        inputFieldStyle.borderColor = "#f1f0f0";
        inputFieldStyle.color = "#000000";
    } else {
        styleChatContainer.backgroundColor = "#ffffff";
        styleChatContainer.borderColor = "#e0e0e0";
        styleChatContainer.color = "#e0e0e0";
        inputFieldStyle.borderColor = "#e0e0e0"
    }

    return (
        <div className={`chat-container ${className}`} style={{ ...styleChatContainer, ...containerStyle }}>
            {persistence && (
                <div className="actionBtnContainer" ref={dropdownRef}>
                    <div className="dropdown">
                        <button className="dotsButton" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            &#x22EE;
                        </button>
                        {dropdownOpen && (
                            <div className="dropdownMenu">
                                <button onClick={handleClearChat} className="dropdownItem">
                                    Clear chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="chat-messages">
                {localMessages.length === 0 ? (
                    <div className="empty-chat">No conversation yet.</div>
                ) : (
                    localMessages.map((message, index) => {
                        if (!message || typeof message !== "object" || !message.role || !message.content) {
                            console.warn(`Invalid message at index ${index}:`, message);
                            return null;
                        }
                        const bubbleStyle = message.role === "user" ? userBubbleStyle : assistantBubbleStyle;
                        return (
                            <div
                                key={index}
                                className={`chat-bubble ${message.role}`}
                                style={bubbleStyle}
                            >
                                <Linkify options={linkifyOptions}>{message.content}</Linkify>
                            </div>
                        )
                    })
                )}
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
                    inputComponentStyles={{...inputFieldStyle, ...inputTextStyle}}
                    placeholder={inputPlaceholder}
                    showTyping={showTyping}
                />
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
     *    - `role` (string): The message sender, either "user" or "assistant".
     *    - `content` (string): The content of the message.
    */
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            role: PropTypes.oneOf(["user", "assistant"]).isRequired,
            content: PropTypes.string.isRequired,
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
    /**
     * Css styles to customize the chat message bubbles.
    */
    bubble_styles: PropTypes.shape({
        user: PropTypes.object,
        assistant: PropTypes.object,
    }),
    /**
     * Placeholder input to bne used in the input field
    */
    input_placeholder: PropTypes.string,
    /**
     * Name for the class attribute to be added to the chat container
    */
    class_name: PropTypes.string,
    /**
     * Whether messages should be stored for persistence
    */
    persistence: PropTypes.bool,
    /**
     * Where persisted messages will be stored
    */
    persistence_type: PropTypes.oneOf(["localStorage", "sessionStorage"]),
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
    fill_width: true,
    bubble_styles: {
        user: {
            ...sharedBubbleStyle,
            backgroundColor: "#007bff",
            color: "white",
            marginLeft: "auto",
            textAlign: "right",
        },
        assistant: {
            ...sharedBubbleStyle,
            backgroundColor: "#f1f0f0",
            color: "black",
            marginRight: "auto",
            textAlign: "left",
        },
    },
    input_placeholder: "",
    class_name: "",
    persistence: false,
    persistence_type: "localStorage",
};

export default ChatComponent;
