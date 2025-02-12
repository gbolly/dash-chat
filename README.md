# dash-chat

[![PyPI version](https://badge.fury.io/py/dash-chat.svg)](https://pypi.org/project/dash-chat/)
[![Supported Python versions](https://img.shields.io/pypi/pyversions/dash-chat.svg)](https://pypi.org/project/dash-chat/)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/gbolly/dash-chat/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/gbolly/dash-chat/tree/main)

dash-chat is a Dash component library chat interface. It provides a customizable and responsive chat UI with support for markdown, chat persistence, typing indicators, themes, and state management.

## Installation
```
$ pip install dash-chat
```

## Basic Usage
The simplest way to use the `dash_chat.ChatComponent` is to initialize the `messages` prop as an empty list. This is a list of messages that initialize the chat UI. Each message is an OpenAI-style dictionary that must have the following key-value pairs:
- `role`: The message sender, either `"user"` or `"assistant"`.
- `content`: The content of the message.

A dash callback chat function is also required to handle how the messages are updated

### Example 1
Using **OpenAI** with dash-chat (requires the `openai` package - install it by running `pip install openai`)

![dash-chat-demo](https://github.com/gbolly/dash-chat/blob/main/dash-chat-demo.gif?raw=true)

```python
import os
import dash
from dash import callback, html, Input, Output, State
from dash_chat import ChatComponent
from openai import OpenAI


api_key = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

app = dash.Dash(__name__)

app.layout = html.Div([
    ChatComponent(
        id="chat-component",
        messages=[],
    )
])

@callback(
    Output("chat-component", "messages"),
    Input("chat-component", "new_message"),
    State("chat-component", "messages"),
    prevent_initial_call=True,
)
def handle_chat(new_message, messages):
    if not new_message:
        return messages

    updated_messages = messages + [new_message]

    if new_message["role"] == "user":
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=updated_messages,
            temperature=1.0,
            max_tokens=150,
        )

        bot_response = {"role": "assistant", "content": response.choices[0].message.content.strip()}
        return updated_messages + [bot_response]

    return updated_messages

if __name__ == "__main__":
    app.run(debug=True)
```

### Example 2

```python
import time
import dash
from dash import callback, html, Input, Output, State
from dash_chat import ChatComponent


app = dash.Dash(__name__)

app.layout = html.Div([
    ChatComponent(
        id="chat-component",
        messages=[],
    )
])

@callback(
    Output("chat-component", "messages"),
    Input("chat-component", "new_message"),
    State("chat-component", "messages"),
    prevent_initial_call=True,
)
def handle_chat(new_message, messages):
    if not new_message:
        return messages

    updated_messages = messages + [new_message]

    if new_message["role"] == "user":
        time.sleep(2)
        bot_response = {"role": "assistant", "content": "Hello John Doe."}
        return updated_messages + [bot_response]

    return updated_messages

if __name__ == "__main__":
    app.run(debug=True)
```

### **Persistence Functionality**
The ChatComponent supports persistence, allowing messages to be stored and retrieved across page reloads. When persistence=True, messages are saved in the specified storage (localStorage or sessionStorage).

On initialization, the component checks for stored messages.
If stored messages exist, they are loaded; otherwise, an empty message list is used.
New messages are automatically saved to storage.
When the page is refreshed, stored messages are restored to maintain chat history.
To enable persistence, set:

```python
ChatComponent(
    id="chat-component",
    persistence=True,
    persistence_type="local"  # or "session"
)
```

### **Props**

`ChatComponent` can be configured with the following properties:

| Prop Name                     | Type                       | Default Value                 | Description                                                                                   |
|-------------------------------|----------------------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| **id**                        | `string`                  | `None`                         | Unique identifier for the component, required for Dash callbacks.                             |
| **container_style**           | `dict`                    | `None`                         | Inline css styles to customize the chat container.                                            |
| **fill_height**               | `boolean`                 | `True`                         | Whether to vertically fill the screen with the chat container. If `False`, constrains height. |
| **fill_width**                | `boolean`                 | `True`                         | Whether to horizontally fill the screen with the chat container. If `False`, constrains width.|
| **input_container_style**     | `dict`                    | `None`                         | Inline css styles for the container holding the message input field.                          |
| **input_text_style**          | `dict`                    | `None`                         | Inline css styles for the message input field itself.                                         |
| **messages**                  | `list of dicts`           | `None`                         | List of chat messages. Each message object must include: `role` and `content`. Initialize as an empty list if no on first load.                  |
| **theme**                     | `string`                  | `"light"`                      | Theme for the chat interface. Options: `"light"` or `"dark"`.                                 |
| **typing_indicator**          | `string`                  | `"dots"`                       | Type of typing indicator. Options: `"dots"` (animated dots) or `"spinner"` (spinner).         |
| **user_bubble_style**         | `dict`                    | `{"backgroundColor": "#007bff", "color": "white", "marginLeft": "auto", "textAlign": "right"}`                                   | Inline css styles to customize the message bubble for user.            |
| **assistant_bubble_style**    | `dict`                    | `{"backgroundColor": "#f1f0f0", "color": "black", "marginRight": "auto", "textAlign": "left"}`                                   | Inline css styles to customize the message bubble for assistant.       |
| **input_placeholder**         | `string`                  | `None`                         | Placeholder text to be used in the input box.                                                 |
| **class_name**                | `string`                  | `None`                         | Name to use as class attribute on the main chat container.                                    |
| **persistence**               | `boolean`                 | `False`                        | Whether to store chat messages so that it can be persisted.                                   |
| **persistence_type**          | `string`                  | `"local"`                      | Where chat messages will be stored for persistence. Options: `"local"` or `"session"`         |

## License

This project is licensed under the MIT License. See the LICENSE file for details.
