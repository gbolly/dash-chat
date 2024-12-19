import os
import time
import dash_chat as dc
from dash import Dash, html, Input, Output, State
from openai import OpenAI


api_key = os.environ.get("OPEN_API_KEY")
client = OpenAI(api_key=api_key)


def predict(message):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=message,
        temperature=1.0,
        max_tokens=150,
    )

    bot_message = {
        "role": "assistant",
        "content": response.choices[0].message.content.strip(),
    }
    return bot_message


app = Dash(__name__)

app.layout = html.Div(
    [
        dc.ChatComponent(
            id="chat-box",
            messages=[
                {"role": "assistant", "content": "Hello! How can I assist you today?"},
            ],
            typing_indicator="dots",
            theme="light",
            fill_height=False,
            fill_width=False,
        ),
        html.Div(id="output"),
    ]
)


@app.callback(
    Output("chat-box", "messages"),
    Input("chat-box", "new_message"),
    State("chat-box", "messages"),
    prevent_initial_call=True,
)
def handle_chat(new_message, messages):
    if not new_message:
        return messages

    updated_messages = messages + [new_message]

    if new_message["role"] == "user":
        time.sleep(2)
        # bot_response = predict(messages)
        bot_response = {"role": "assistant", "content": "Hello John Doe."}
        return updated_messages + [bot_response]

    return updated_messages


if __name__ == "__main__":
    app.run_server(debug=True)
