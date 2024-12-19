import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatComponent from "../../src/lib/components/ChatComponent";

describe("ChatComponent", () => {
    const mockSetProps = jest.fn();

    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });    

    const defaultProps = {
        id: "chat",
        messages: [
            { role: "assistant", content: "Hello! How can I assist you today?" },
            { role: "user", content: "I need help with my account." },
        ],
        theme: "light",
        typing_indicator: "dots",
        setProps: mockSetProps,
        fill_height: true,
        fill_width: true,
    };

    it("renders chat messages correctly", () => {
        render(<ChatComponent {...defaultProps} />);
        expect(screen.getByText("Hello! How can I assist you today?")).toBeInTheDocument();
        expect(screen.getByText("I need help with my account.")).toBeInTheDocument();
    });

    it("applies the correct theme class", () => {
        const { container } = render(<ChatComponent {...defaultProps} theme="dark" />);
        const divs = container.querySelectorAll("div");
        expect(divs[1]).toHaveClass("default2");
    });

    it("hides typing indicators after assistant response", async () => {
        const { rerender } = render(<ChatComponent {...defaultProps} />);
        const inputField = screen.getByRole("textbox");
        fireEvent.change(inputField, { target: { value: "This is a test message" } });
        const sendButton = screen.getByRole("button", { name: /send/i });
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

    it("allows the user to type a message and send it", () => {
        render(<ChatComponent {...defaultProps} />);
        const inputField = screen.getByRole("textbox");
        const sendButton = screen.getByRole("button", { name: /send/i });

        fireEvent.change(inputField, { target: { value: "This is a test message" } });
        expect(inputField.value).toBe("This is a test message");

        fireEvent.click(sendButton);
        expect(mockSetProps).toHaveBeenCalledWith({
            new_message: { role: "user", content: "This is a test message" },
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
        expect(chatContainer).toHaveStyle("height: 95vh");
        expect(chatContainer).toHaveStyle("width: 100%");
    });

    it("applies correct height and width when fillHeight is true and fillWidth is false", () => {
        const { container } = render(<ChatComponent {...defaultProps} fill_height={true} fill_width={false} />);

        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("height: 95vh");
        expect(chatContainer).toHaveStyle("width: 50%");
        expect(chatContainer).toHaveStyle("margin: 0 auto");
    });

    it("applies correct height and width when fillHeight is false and fillWidth is true", () => {
        const { container } = render(<ChatComponent {...defaultProps} fill_height={false} fill_width={true} />);

        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("height: 50vh");
        expect(chatContainer).toHaveStyle("width: 100%");
    });

    it("applies correct height and width when fillHeight and fillWidth are false", () => {
        const { container } = render(<ChatComponent {...defaultProps} fill_height={false} fill_width={false} />);

        const chatContainer = container.querySelector(".chat-container");
        expect(chatContainer).toHaveStyle("height: 50vh");
        expect(chatContainer).toHaveStyle("width: 50%");
        expect(chatContainer).toHaveStyle("margin: 0 auto");
    });
});
