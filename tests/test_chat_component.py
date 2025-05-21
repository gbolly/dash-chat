import os
import chromedriver_binary  # noqa
import pytest
from dash.testing.application_runners import import_app


@pytest.mark.usefixtures("dash_duo")
def test_render_chat_component(dash_duo):
    """Test chat component rendering, messaging functionality, and persistence."""

    # import and start the Dash app
    app = import_app("usage.usage")
    dash_duo.start_server(app)
    input_box = dash_duo.wait_for_element_by_css_selector(
        "textarea.message-input-field"
    )
    send_button = dash_duo.find_element(".message-input-button")
    input_box.clear()
    input_box.send_keys("Hello!")
    send_button.click()

    # Test 1: verify user message is rendered
    first_message = dash_duo.wait_for_element_by_css_selector(
        ".chat-bubble:first-child"
    )
    assert "Hello!" in first_message.text

    # Test 2: verify input assistant response is rendered
    assistant_message = dash_duo.wait_for_element_by_css_selector(
        ".chat-bubble:nth-child(2)"
    )
    assert "Hello John Doe." in assistant_message.text

    # Test 3: ensure typing indicator appears when user sends a message
    input_box.clear()
    input_box.send_keys("Hi dash-chat, this is the user")
    send_button.click()
    typing_indicator = dash_duo.wait_for_element_by_css_selector(".typing-indicator")
    assert typing_indicator.is_displayed()

    # Test 4: verify user message is displayed correctly
    user_message = dash_duo.wait_for_element_by_css_selector(
        ".chat-bubble:nth-child(3)"
    )
    assert "Hi dash-chat, this is the user" in user_message.text

    # Test 5: wait for assistant response and ensure typing indicator disappears
    bot_response = dash_duo.wait_for_text_to_equal(
        ".chat-bubble:nth-child(4)",
        "Hello John Doe.",
    )
    assert bot_response is not None

    # Test 6: verify image shows up in chat
    file_input = dash_duo.wait_for_element_by_css_selector("input[type='file']")
    test_image_path = os.path.abspath("tests/assets/test-image.png")
    file_input.send_keys(test_image_path)
    file_preview = dash_duo.wait_for_element_by_css_selector(".file-preview-image")
    assert file_preview.is_displayed(), "Image preview should be visible after upload"
    send_button = dash_duo.find_element(".message-input-button")
    send_button.click()
    uploaded_message = dash_duo.wait_for_element_by_css_selector(
        ".chat-bubble:nth-child(5)"
    )
    assert (
        uploaded_message.is_displayed()
    ), "Uploaded image should be displayed in the chat"
