# dash-chat

[![PyPI version](https://badge.fury.io/py/dash-chat.svg)](https://pypi.org/project/dash-chat/)
[![Supported Python versions](https://img.shields.io/pypi/pyversions/dash-chat.svg)](https://pypi.org/project/dash-chat/)
[![CircleCI Builds](https://circleci.com/gh/gbolly/dash-chat.svg?style=shield)](https://circleci.com/gh/gbolly/dash-chat)

dash-chat is a Dash component library chat interface. It provides a customizable and responsive chat UI with support for typing indicators, themes, and state management.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Features

- Uses the `dash_chat.ChatComponent`, a high-level abstraction to display messages exchanged between two users, typically a **user** and an **assistant**.
- Customizable themes and inline styles for the chat UI.
- Typing indicators for both the user and the assistant.
- Easy integration with Dash using the `set_props` callback for state management.
- Support for custom input components.

## Installation
```
$ pip install dash-chat
```

## Basic Usage
The simplest way to use the `dash_chat.ChatComponent` is to provide the `messages` prop. This is a list of messages that initialize the chat UI. Each message is an OpenAI-style dictionary that must have the following key-value pairs:
- `role`: The message sender, either `"user"` or `"assistant"`.
- `content`: The content of the message.

A dash callback chat function is also required to handle how the messages are updated

### Example 1

```python
import time
import dash
from dash import callback, html, Input, Output, State
from dash_chat import ChatComponent

app = dash.Dash(__name__)

app.layout = html.Div([
    ChatComponent(
        id="chat-component",
        messages=[
            {"role": "user", "content": "Hello!"},
        ],
    )
])

@callback(
    Output("chat-component", "messages")
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
    app.run_server(debug=True)
```

### Example 2
Using **OpenAI** with dash-chat (requires the `openai` package - install it by running `pip install openai`)

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
        messages=[
<<<<<<< HEAD
            {"role": "user", "content": "Hello!"},
=======
            {"sender": "assistant", "text": "Hello!"},
>>>>>>> db5ed0d (Remove some redundant props and update how the typing indeicator is displayed)
        ],
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

<<<<<<< HEAD
    if new_message["role"] == "user":
=======
    if new_message["sender"] == "user":
        openai_messages = [
            {"role": msg["sender"], "content": msg["text"]}
            for msg in messages
        ]
>>>>>>> db5ed0d (Remove some redundant props and update how the typing indeicator is displayed)
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
    app.run_server(debug=True)
```

### **Props**

`ChatComponent` can be configured with the following properties:

| Prop Name                     | Type                       | Default Value                 | Description                                                                                   |
|-------------------------------|----------------------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| **id**                        | `string`                  | `None`                         | Unique identifier for the component, required for Dash callbacks.                             |
| **container_style**           | `dict`                    | `None`                         | Inline css styles to customize the chat container.                                            |
| **fill_height**               | `boolean`                 | `True`                         | Whether to vertically fill the screen with the chat container. If `False`, constrains height. |
| **fill_width**                | `boolean`                 | `True`                         | Whether to horizontally fill the screen with the chat container. If `False`, constrains width.|
| **input_container_style**     | `dict`                    | `None`                         | Inline styles for the container holding the message input field.                             |
| **input_text_style**          | `dict`                    | `None`                         | Inline styles for the message input field itself.                                            |
| **messages**                  | `list of dicts`           | `None`                         | List of chat messages. Each message object must include: `role` and `content`.               |
| **theme**                     | `string`                  | `"light"`                      | Theme for the chat interface. Options: `"light"` or `"dark"`.                                |
| **typing_indicator**          | `string`                  | `"dots"`                       | Type of typing indicator. Options: `"dots"` (animated dots) or `"spinner"` (spinner).        |
