# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class DotsIndicator(Component):
    """A DotsIndicator component.
    A resuable dots typing indicator

    Keyword arguments:

    - color (string; default "gray"):
        Color of the dots."""

    _children_props = []
    _base_nodes = ["children"]
    _namespace = "dash_chat"
    _type = "DotsIndicator"

    @_explicitize_args
    def __init__(self, color=Component.UNDEFINED, **kwargs):
        self._prop_names = ["color"]
        self._valid_wildcard_attributes = []
        self.available_properties = ["color"]
        self.available_wildcard_properties = []
        _explicit_args = kwargs.pop("_explicit_args")
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(DotsIndicator, self).__init__(**args)
