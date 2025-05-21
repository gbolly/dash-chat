import dash
from dash import callback, html, Input, Output, State
from dash_chat import ChatComponent


app = dash.Dash(__name__)
app.layout = html.Div(
    [
        ChatComponent(
            id="chat-component",
            messages=[],
            class_name="container",
            persistence=True,
            persistence_type="local",
        )
    ]
)


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
        bot_response = {
            "role": "assistant",
            "content": {
                "type": "graph",
                "props": {
                    "figure": {
                        "data": [
                            {
                                "x": [1, 2, 3],
                                "y": [4, 1, 2],
                                "type": "bar",
                                "name": "Sample Bar",
                            }
                        ],
                        "layout": {"title": "Bar Chart Example", "autosize": True},
                    },
                    "config": {"displaylogo": True, "displayModeBar": True},
                    "responsive": True,
                },
            },
        }

        return updated_messages + [bot_response]

    return updated_messages


if __name__ == "__main__":
    app.run(debug=True)
