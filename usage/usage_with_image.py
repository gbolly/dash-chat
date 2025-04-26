import base64
import dash
import os
import re
from io import BytesIO
from dash import callback, html, Input, Output, State
from dash_chat import ChatComponent
from openai import OpenAI

api_key = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

app = dash.Dash(__name__)

app.layout = html.Div(
    [
        ChatComponent(
            id="chat-component",
            messages=[],
            persistence=True,
            persistence_type="local",
            input_placeholder="Message Dash",
            supported_input_file_types=[".png", ".jpg"],
        )
    ]
)


def decode_base64(data):
    match = re.match(r"data:(.*?);base64,(.*)", data)
    if match:
        _, base64_data = match.groups()
    else:
        base64_data = data

    missing_padding = len(base64_data) % 4
    if missing_padding:
        base64_data += "=" * (4 - missing_padding)

    return base64.b64decode(base64_data)


@callback(
    Output("chat-component", "messages"),
    Input("chat-component", "new_message"),
    State("chat-component", "messages"),
    prevent_initial_call=True,
)
def handle_chat(new_message, messages):
    if not new_message:
        return messages

    if isinstance(new_message["content"], list):
        user_content = []
        for item in new_message["content"]:
            if item["type"] == "text":
                user_content.append({"type": "text", "text": item["text"]})
            elif item["type"] == "attachment":
                file_type = item["fileType"]
                file_path = item["file"]
                file_name = item["fileName"]

                if file_type.startswith("image/"):
                    user_content.append(
                        {"type": "image_url", "image_url": {"url": file_path}}
                    )
                else:
                    # other file types (PDF, DOCX, etc.)
                    decoded_bytes = decode_base64(file_path)
                    client.files.create(
                        file=(file_name, BytesIO(decoded_bytes), file_type),
                        purpose="user_data",
                    )
        updated_messages = messages + [{"role": "user", "content": user_content}]
    else:
        updated_messages = messages + [new_message]

    if new_message["role"] == "user":
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=updated_messages,
            temperature=1.0,
            max_tokens=150,
        )

        bot_response = {
            "role": "assistant",
            "content": response.choices[0].message.content.strip(),
        }

        return updated_messages + [bot_response]

    return updated_messages


if __name__ == "__main__":
    app.run(debug=True)
