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
 *     showTyping={showTyping}
 *     setAttachment={showTsetAttachmentyping}
 * />
 * ```
*/

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Paperclip, Send, X, FileText } from "lucide-react";

/**
 * A reusable message input component for chat interfaces.
*/

const MessageInput = ({
    onSend,
    handleInputChange,
    value,
    setAttachment,
    placeholder = "Start typing...",
    buttonLabel,
    customStyles = null,
    inputComponentStyles = null,
    showTyping = false,
    accept,
}) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const fileType = file.type;

        if (file) {
            setSelectedFile(file);
            setAttachment(file);

            if (fileType.startsWith("image/")) {
                setFilePreview(URL.createObjectURL(file));
            } else {
                setFilePreview(file.name);
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
    };

    const handleSend = () => {
        if (value.trim() || selectedFile) {
            onSend(value.trim(), selectedFile);
            setSelectedFile(null);
            setFilePreview(null);
        }
    };

    return (
        <div className="message-input-container" style={customStyles}>
            {filePreview && (
                <div className="file-preview-container">
                    <button
                        className="remove-file-button"
                        onClick={handleRemoveFile}
                        data-testid="file-remove-button"
                    >
                        <X size={10} />
                    </button>
                    {(
                        selectedFile.type === "application/pdf" ||
                        selectedFile.type === "application/msword" ||
                        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ) ? (
                        <div className="file-preview">
                            <FileText size={15} />
                            <p className="file-name-preview">{selectedFile.name}</p>
                        </div>
                    ) : selectedFile.type.startsWith("image/") ? (
                        <img src={filePreview} alt="Preview" className="file-preview-image" />
                    ) : <p className="file-name-preview">{selectedFile.name} unsupported</p>}
                </div>
            )}
            <textarea
                name="text"
                wrap="soft"
                value={value}
                placeholder={placeholder}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !showTyping) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                style={inputComponentStyles}
                className="message-input-field"
            />
            <div className="input-with-icons">
                <button
                    className="file-upload-button"
                    onClick={() => fileInputRef.current.click()}
                    data-testid="file-upload-button"
                >
                    <Paperclip size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept={Array.isArray(accept) ? accept.join(",") : accept}
                    onChange={handleFileUpload}
                    data-testid="file-input"
                />
                <button
                    onClick={handleSend}
                    className={`message-input-button ${showTyping ? 'disabled' : ''}`}
                    data-testid="send-button"
                    disabled={showTyping}
                >
                    {buttonLabel ? buttonLabel : <Send size={18} />}
                </button>
            </div>
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
    /**
     * Set file attached to state.
    */
    setAttachment: PropTypes.func,
    /**
     * String or array of supported file types.
    */
    accept: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
};

export default MessageInput;
