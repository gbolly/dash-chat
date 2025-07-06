/**
 * Example Usage:
 * ```
 * <MessageInput
 *     onSend={handleSend}
 *     handleInputChange={handleInput}
 *     value={messageValue}
 *     placeholder="Type your message here"
 *     customStyles={{ backgroundColor: "#f0f0f0" }}
 *     inputComponentStyles={{ padding: "10px" }}
 *     showTyping={showTyping}
 *     setAttachment={setAttachment}
 *     accept={["image/*", "application/pdf"]}
 *     file_attachment_button_config={{
 *         show: true,
 *         label: "Attach File",
 *         icon: "paperclip",
 *         icon_position: "left",
 *         style: { color: "#007bff" },
 *         className: "custom-file-button"
 *     }}
 *     send_button_config={{
 *         label: "Send",
 *         icon: "paper-plane",
 *         icon_position: "right",
 *         style: { backgroundColor: "#28a745", color: "#fff" },
 *         className: "custom-send-button"
 *     }}
 * />
 * ```
*/

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
    Paperclip,
    Send,
    X,
    FileText,
    SendHorizontal,
    Folder
} from "lucide-react";

/**
 * A reusable message input component for chat interfaces.
*/

const IconMap = {
    "paper-plane": <Send size={16} />,
    "paper-plane-horizontal": <SendHorizontal size={16} />,
    "paperclip": <Paperclip size={16} />,
    "file": <FileText size={16} />,
    "folder": <Folder size={16} />
}

const MessageInput = ({
    onSend,
    handleInputChange,
    value,
    setAttachment,
    placeholder = "Start typing...",
    customStyles = null,
    inputComponentStyles = null,
    showTyping = false,
    accept,
    file_attachment_button_config = {
        show: true,
        label: "Attach File",
        icon: "paperclip",
        icon_position: "only",
        style: {},
        className: "",
    },
    send_button_config = {
        label: "Send",
        icon: "paper-plane",
        icon_position: "only",
        style: {},
        className: "",
    },
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

    const renderButtonContent = ({ icon, label, icon_position }) => {
        const iconElement = IconMap[icon] || null;

        return (
            <>
                {iconElement && icon_position === "left" && <span className="icon-left">{iconElement}</span>}
                {icon_position !== "only" && <span className="button-label">{label}</span>}
                {iconElement && icon_position === "right" && <span className="icon-right">{iconElement}</span>}
                {iconElement && icon_position === "only" && <span className="icon-only">{iconElement}</span>}
            </>
        );
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
                {file_attachment_button_config.show && (
                    <>
                        <button
                            type="button"
                            className={`file-upload-button ${file_attachment_button_config.className}`}
                            onClick={() => fileInputRef.current.click()}
                            style={file_attachment_button_config.style}
                            disabled={showTyping}
                            data-testid="file-upload-button"
                        >
                            {renderButtonContent(file_attachment_button_config)}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept={Array.isArray(accept) ? accept.join(",") : accept}
                            onChange={handleFileUpload}
                            data-testid="file-input"
                        />
                    </>
                )}

                <button
                    onClick={handleSend}
                    type="button"
                    disabled={showTyping}
                    className={`message-input-button btn ${send_button_config.className} ${showTyping ? "disabled" : ""}`}
                    style={send_button_config.style}
                    data-testid="send-button"
                >
                    {renderButtonContent(send_button_config)}
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
    /**
     * Configuration for the file attachment button.
     * - `show`: Whether to show the button.
     * - `label`: Text label for the button.
     * - `icon`: Icon name or URL for the button.
     * - `icon_position`: Position of the icon relative to text ("left", "right", "only").
     * - `style`: Custom styles for the button.
     * - `className`: Additional class names for styling.
    */
    file_attachment_button_config: PropTypes.shape({
        show: PropTypes.bool,
        label: PropTypes.string,
        icon: PropTypes.oneOf(["paper-plane-horizontal", "paper-plane", "folder", "file", "paperclip"]),
        icon_position: PropTypes.oneOf(["left", "right", "only"]),
        style: PropTypes.object,
        className: PropTypes.string,
    }),
    /**
     * Configuration for the send button.
     * - `label`: Text label for the button.
     * - `icon`: Icon name or URL for the button.
     * - `icon_position`: Position of the icon relative to text ("left", "right", "only").
     * - `style`: Custom styles for the button.
     * - `className`: Additional class names for styling.
    */
    send_button_config: PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.oneOf(["paper-plane-horizontal", "paper-plane", "folder", "file", "paperclip"]),
        icon_position: PropTypes.oneOf(["left", "right", "only"]),
        style: PropTypes.object,
        className: PropTypes.string,
    }),
};

export default MessageInput;
