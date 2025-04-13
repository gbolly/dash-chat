import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatComponent from "../../src/lib/components/ChatComponent";

describe("ChatComponent", () => {
    global.URL.createObjectURL = jest.fn();
    const mockSetProps = jest.fn();
    Date.now = jest.fn(() => 1741822740027);

    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        global.URL.createObjectURL = jest.fn(() => "mocked-file-url");
    });    

    const defaultProps = {
        id: "chat",
        messages: [],
        theme: "light",
        typing_indicator: "dots",
        setProps: mockSetProps,
        fill_height: true,
        fill_width: true,
    };

    test("displays 'No conversation yet' when there are no messages", () => {
        render(<ChatComponent {...defaultProps} />);
        expect(screen.getByText("No conversation yet.")).toBeInTheDocument();
    });

    it("renders chat messages correctly", () => {
        render(
            <ChatComponent
                {...defaultProps}
                messages={[
                    { role: "assistant", content: "Hello! How can I assist you today?" },
                    { role: "user", content: "I need help with my account." },
                ]}
            />
        );
        expect(screen.getByText("Hello! How can I assist you today?")).toBeInTheDocument();
        expect(screen.getByText("I need help with my account.")).toBeInTheDocument();
    });

    it("applies the light theme", () => {
        const { container } = render(<ChatComponent {...defaultProps} />);
        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("color: #e0e0e0");
        expect(chatContainer).toHaveStyle("border-color: #e0e0e0");
        expect(chatContainer).toHaveStyle("background-color: #ffffff");
    });

    it("applies the dark theme", () => {
        const { container } = render(<ChatComponent {...defaultProps} theme="dark" />);
        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("color: #ffffff");
        expect(chatContainer).toHaveStyle("border-color: #444444");
        expect(chatContainer).toHaveStyle("background-color: #161618");
    });

    it("hides typing indicators after assistant response", async () => {
        const { rerender } = render(<ChatComponent {...defaultProps} />);
        const inputField = screen.getByRole("textbox");
        fireEvent.change(inputField, { target: { value: "This is a test message" } });
        const sendButton = screen.getByTestId("send-button");
        fireEvent.click(sendButton);
    
        await waitFor(() => {
            expect(screen.getByTestId("typing-indicator")).toBeInTheDocument();
        });
    
        // Simulate assistant response
        rerender(
            <ChatComponent
                {...defaultProps}
                messages={[
                    { role: "user", content: "Hello" },
                    { role: "assistant", content: "Hi there!" },
                ]}
            />
        );
    
        await waitFor(() => {
            expect(screen.queryByTestId("typing-indicator")).not.toBeInTheDocument();
        });
    });

    it("allows the user to attach a file", async () => {
        render(<ChatComponent setProps={mockSetProps} />);

        const fileInput = screen.getByTestId("file-input");
        const fileUploadButton = screen.getByTestId("file-upload-button");
        const testFile = new File(["dummy content"], "test-file.pdf", { type: "application/pdf" });
        fireEvent.click(fileUploadButton);
        fireEvent.change(fileInput, { target: { files: [testFile] } });

        expect(screen.getByText("test-file.pdf")).toBeInTheDocument();
    });

    it("allows the user to remove an attached file", () => {
        render(<ChatComponent setProps={mockSetProps} />);
        const testFile = new File(["dummy image"], "image.png", { type: "image/png" });
        const fileInput = screen.getByTestId("file-input");
        fireEvent.change(fileInput, { target: { files: [testFile] } });

        // Expect file preview to appear
        expect(screen.getByAltText("Preview")).toBeInTheDocument();

        // Click remove button
        const removeFileButton = screen.getByTestId("file-remove-button");
        fireEvent.click(removeFileButton);

        // Expect the file preview to be removed
        expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    });

    it("allows the user to type a message and send it", () => {
        render(<ChatComponent {...defaultProps} />);
        const inputField = screen.getByRole("textbox");
        const sendButton = screen.getByTestId("send-button");

        fireEvent.change(inputField, { target: { value: "This is a test message" } });
        expect(inputField.value).toBe("This is a test message");

        expect(sendButton).not.toHaveClass("disabled");
        expect(sendButton).not.toBeDisabled();
    
        fireEvent.click(sendButton);

        expect(mockSetProps).toHaveBeenCalledWith({
            new_message: { role: "user", content: "This is a test message", id: 1741822740027 },
        });
    });

    it("should scroll to the bottom when a new message is added", () => {
        const { getByTestId } = render(<ChatComponent messages={[{ role: "assistant", content: "This is a test message" }]} />);
        
        fireEvent.click(getByTestId("send-button"));
        expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });

    it("applies correct height and width when fillHeight and fillWidth are true", () => {
        const { container } = render(<ChatComponent {...defaultProps} fill_height={true} fill_width={true} />);

        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("height: 100%");
        expect(chatContainer).toHaveStyle("width: auto");
    });

    it("applies correct height and width when fillHeight is true and fillWidth is false", () => {
        const { container } = render(<ChatComponent {...defaultProps} fill_height={true} fill_width={false} />);

        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("height: 100%");
        expect(chatContainer).toHaveStyle("width: 50%");
    });

    it("applies correct height and width when fillHeight is false and fillWidth is true", () => {
        const { container } = render(<ChatComponent {...defaultProps} fill_height={false} fill_width={true} />);

        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("height: 50%");
        expect(chatContainer).toHaveStyle("width: auto");
    });

    it("applies correct height and width when fillHeight and fillWidth are false", () => {
        const { container } = render(<ChatComponent {...defaultProps} fill_height={false} fill_width={false} />);

        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("height: 50%");
        expect(chatContainer).toHaveStyle("width: 50%");
    });

    it("saves messages to localStorage when persistence is enabled", () => {
        const id = "chat-component";
        const messages = [{ role: "user", content: "Hello!", id: 1741822740027 }];
        render(<ChatComponent id={id} persistence={true} persistence_type="local" />);
        const inputField = screen.getByRole("textbox");
        const sendButton = screen.getByTestId("send-button");

        fireEvent.change(inputField, { target: { value: "Hello!" } });
        fireEvent.click(sendButton);
        expect(JSON.parse(localStorage.getItem(id))).toEqual(messages);
    });

    it("persist messages after refresh", () => {
        const id = "chat-component";
        const storedMessages = [{ role: "assistant", content: "Welcome back!" }];
        localStorage.setItem(id, JSON.stringify(storedMessages));
        render(<ChatComponent id={id} persistence={true} persistence_type="local" />);
        expect(screen.getByText("Welcome back!")).toBeInTheDocument();
    });

    it("removes messages from UI and storage on clear chat", () => {
        const id = "chat-component";
        const storedMessages = [{ role: "user", content: "Old message" }];
        localStorage.setItem(id, JSON.stringify(storedMessages));
        render(<ChatComponent id={id} persistence={true} persistence_type="local" />);

        const DropdownBtn = screen.getByRole("button", { name: "clear" });
        fireEvent.click(DropdownBtn);

        const clearBtn = screen.getByRole("button", { name: /clear chat/i });
        expect(screen.getByText("Old message")).toBeInTheDocument();
        fireEvent.click(clearBtn);

        expect(screen.queryByText("Old message")).not.toBeInTheDocument();
        expect(localStorage.getItem(id)).toBeNull();
    });
});
