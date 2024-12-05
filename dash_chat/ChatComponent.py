# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class ChatComponent(Component):
    """A ChatComponent component.
ChatComponent - A React-based chat interface with customizable styles and typing indicators.
* This component provides a chat interface with support for:
- Displaying messages exchanged between 2 users typically a user and an assistant.
- Customizable themes and styles for the chat UI.
- Typing indicators for both the user and assistant.
- Integration with Dash via the `setProps` callback for state management.

Keyword arguments:

- id (string; optional):
    The ID of this component, used to identify dash components in
    callbacks. The ID needs to be unique across all of the components
    in an app.

- customStyles (dict; optional):
    Inline styles to customize the chat container.

- inputComponent (optional):
    A custom message React input component. If provided, it will
    override the default input field.

- isTyping (dict; default { user: False, assistant: False }):
    Indicates whether the user or assistant is typing. Should be an
    object with:    - `user` (boolean): True if the user is typing.
    - `assistant` (boolean): True if the assistant is typing.

    `isTyping` is a dict with keys:

    - user (boolean; optional)

    - assistant (boolean; optional)

- messageInputContainerStyle (dict; optional):
    Inline styles for the container holding the message input field.

- messageInputStyle (dict; optional):
    Inline styles for the message input field itself.

- messages (list of dicts; optional):
    An array of options. The list of chat messages. Each message
    object should have:    - `sender` (string): The message sender,
    either \"user\" or \"assistant\".    - `text` (string): The
    content of the message.

    `messages` is a list of dicts with keys:

    - sender (a value equal to: "user", "assistant"; optional)

    - text (string; required)

- newMessage (dict; optional):
    Latest chat message that was appended to messages array.

- theme (string; default "lightTheme"):
    Theme for the chat interface. Default is \"lightTheme\". Use
    \"darkTheme\" for a dark mode appearance.

- typingIndicator (a value equal to: "dots", "spinner"; default "dots"):
    The type of typing indicator to display. Options are:    -
    `\"dots\"`: Displays animated dots.    - `\"spinner\"`: Displays a
    spinner animation."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_chat'
    _type = 'ChatComponent'
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, messages=Component.UNDEFINED, theme=Component.UNDEFINED, customStyles=Component.UNDEFINED, typingIndicator=Component.UNDEFINED, inputComponent=Component.UNDEFINED, newMessage=Component.UNDEFINED, messageInputContainerStyle=Component.UNDEFINED, messageInputStyle=Component.UNDEFINED, isTyping=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'customStyles', 'inputComponent', 'isTyping', 'messageInputContainerStyle', 'messageInputStyle', 'messages', 'newMessage', 'theme', 'typingIndicator']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'customStyles', 'inputComponent', 'isTyping', 'messageInputContainerStyle', 'messageInputStyle', 'messages', 'newMessage', 'theme', 'typingIndicator']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(ChatComponent, self).__init__(**args)
