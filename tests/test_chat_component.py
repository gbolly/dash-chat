import chromedriver_binary  # noqa
import pytest
from dash.testing.application_runners import import_app


@pytest.mark.usefixtures("dash_duo")
def test_render_chat_component(dash_duo):
    # import the Dash app defined in usage.py
    app = import_app("usage")
    dash_duo.start_server(app)

    # test 1: verify that initial chat messages are rendered
    first_message = dash_duo.wait_for_element_by_css_selector(
        ".chat-messages:nth-child(1)"
    )
    assert "Hello!" in first_message.text

    # test 2: verify input field and typing functionality
    input_box = dash_duo.wait_for_element_by_css_selector("input[type='text']")
    send_button = dash_duo.wait_for_element_by_css_selector("button")

    # clear the input box and type a message
    input_box.clear()
    input_box.send_keys("Hi dash-chat, this is the user")
    send_button.click()

    # test 3: ensure typing indicator appears when typing
    typing_indicator = dash_duo.wait_for_element_by_css_selector(".typing-indicator")
    assert typing_indicator.is_displayed()

    # test 4: verify that user chat messages are rendered
    second_message = dash_duo.wait_for_element_by_css_selector(
        ".chat-bubble:nth-child(2)"
    )
    assert "Hi dash-chat, this is the user" in second_message.text

    # Wait for the new message to appear in the chat
    dash_duo.wait_for_text_to_equal(".chat-bubble:nth-child(3", "Hello John Doe.")

    # test 5: ensure the correct theme is applied
    chat_container = dash_duo.wait_for_element_by_css_selector(".chat-container")
    assert "default1" in chat_container.get_attribute("class")  # Theme class
