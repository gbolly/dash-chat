import dash
from dash import callback, html, Input, Output, State
import dash_bootstrap_components as dbc
from dash_chat import ChatComponent


app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

app.layout = html.Div(
    [
        ChatComponent(
            id="chat-component",
            messages=[],
            class_name="container",
            persistence=True,
            persistence_type="local",
            user_bubble_style={"paddingTop": "10px"},
            assistant_bubble_style={"paddingTop": "10px"},
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
            "content": [
                {"type": "text", "text": "Here's a graph and table for you."},
                {
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
                        "config": {"displayModeBar": True},
                        "responsive": True,
                    },
                },
                {
                    "type": "table",
                    "header": ["Order ID", "Item", "Quantity", "Total"],
                    "data": [
                        ["#1021", "Apple iPhone 14", 1, "$799"],
                        ["#1022", "Samsung Galaxy S22", 2, "$1398"],
                        ["#1023", "Google Pixel 7", 1, "$599"],
                    ],
                    "props": {
                        "striped": True,
                        "bordered": True,
                        "hover": True,
                        "responsive": True,
                        "size": "lg",
                        "style": {
                            "backgroundColor": "#f9f9f9",
                            "fontSize": "14px",
                        },
                    },
                },
            ],
        }

        return updated_messages + [bot_response]

    return updated_messages


if __name__ == "__main__":
    app.run(debug=True)
