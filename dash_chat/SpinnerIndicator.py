# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class SpinnerIndicator(Component):
    """A SpinnerIndicator component.
    A resuable spinner typing indicator

    Keyword arguments:

    - color (string; default "gray"):
        Color of the spinner.

    - size (number; default 20):
        size of the spinner."""

    _children_props = []
    _base_nodes = ["children"]
    _namespace = "dash_chat"
    _type = "SpinnerIndicator"

    @_explicitize_args
    def __init__(self, size=Component.UNDEFINED, color=Component.UNDEFINED, **kwargs):
        self._prop_names = ["color", "size"]
        self._valid_wildcard_attributes = []
        self.available_properties = ["color", "size"]
        self.available_wildcard_properties = []
        _explicit_args = kwargs.pop("_explicit_args")
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(SpinnerIndicator, self).__init__(**args)
