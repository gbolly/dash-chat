# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class ChatMessageInput(Component):
    """A ChatMessageInput component.
    A reusable message input component for chat interfaces.

    Keyword arguments:

    - buttonLabel (string; default "Send"):
        Label for the send button. Default is `\"Send\"`.

    - customStyles (dict; optional):
        Inline styles for the container holding the input and button.

    - inputComponentStyles (dict; optional):
        Inline styles for the input field.

    - placeholder (string; default "Start typing..."):
        Placeholder text for the input field. Default is `\"Start
        typing...\"`.

    - value (string; optional):
        The current value of the input field."""

    _children_props = []
    _base_nodes = ["children"]
    _namespace = "dash_chat"
    _type = "ChatMessageInput"

    @_explicitize_args
    def __init__(
        self,
        onSend=Component.REQUIRED,
        handleInputChange=Component.REQUIRED,
        value=Component.UNDEFINED,
        placeholder=Component.UNDEFINED,
        buttonLabel=Component.UNDEFINED,
        customStyles=Component.UNDEFINED,
        inputComponentStyles=Component.UNDEFINED,
        **kwargs
    ):
        self._prop_names = [
            "buttonLabel",
            "customStyles",
            "inputComponentStyles",
            "placeholder",
            "value",
        ]
        self._valid_wildcard_attributes = []
        self.available_properties = [
            "buttonLabel",
            "customStyles",
            "inputComponentStyles",
            "placeholder",
            "value",
        ]
        self.available_wildcard_properties = []
        _explicit_args = kwargs.pop("_explicit_args")
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(ChatMessageInput, self).__init__(**args)
