import os
import time
import dash_chat as dc
from dash import Dash, html, Input, Output, State
from openai import OpenAI


api_key = os.environ.get("OPEN_API_KEY")
client = OpenAI(api_key=api_key)


def predict(message):
    openai_messages = [
        {"role": msg["sender"], "content": msg["text"]} for msg in message
    ]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=openai_messages,
        temperature=1.0,
        max_tokens=150,
    )

    bot_message = {
        "sender": "assistant",
        "text": response.choices[0].message.content.strip(),
    }
    return bot_message


app = Dash(__name__)

app.layout = html.Div(
    [
        dc.ChatComponent(
            id="chat-component",
            messages=[
                {"sender": "assistant", "text": "Hello! How can I assist you today?"},
            ],
            typing_indicator="dots",
            theme="lightTheme",
            is_typing={"user": False, "assistant": False},
            fill_height=False,
            fill_width=False,
        ),
        html.Div(id="output"),
    ]
)


@app.callback(
    [Output("chat-component", "messages"), Output("chat-component", "is_typing")],
    Input("chat-component", "new_message"),
    State("chat-component", "messages"),
    prevent_initial_call=True,
)
def handle_chat(new_message, messages):
    if not new_message:
        return messages, {"user": False, "assistant": False}

    updated_messages = messages + [new_message]

    if new_message["sender"] == "user":
        time.sleep(2)
        # bot_response = predict(messages)
        bot_response = {"sender": "assistant", "text": "Hello John Doe."}
        return updated_messages + [bot_response], {"user": False, "assistant": False}

    return updated_messages, {"user": False, "assistant": False}


if __name__ == "__main__":
    app.run_server(debug=True)
