
<!-- Auto Generated Below -->


## Overview

Nested `close` events

When putting other elements that emit `close` events inside a dialog, those
events must be caught and stopped inside the dialog. If not, they will bubble
to the event handler listening for `close` events on the dialog, which will
close the dialog too.

This example has an event handler for the `close` event on the dialog, and
a second event handler for the `close` event on the collapsible-section.

Try it out with the _Stop the inner close-event_ switch disabled, and then
with the switch enabled, to see the difference.

## Dependencies

### Depends on

- [limel-button](../../button)
- [limel-dialog](..)
- [limel-collapsible-section](../../collapsible-section)
- [limel-example-controls](../../../examples)
- [limel-switch](../../switch)

### Graph
```mermaid
graph TD;
  limel-example-dialog-nested-close-events --> limel-button
  limel-example-dialog-nested-close-events --> limel-dialog
  limel-example-dialog-nested-close-events --> limel-collapsible-section
  limel-example-dialog-nested-close-events --> limel-example-controls
  limel-example-dialog-nested-close-events --> limel-switch
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-dialog --> limel-header
  limel-header --> limel-icon
  limel-collapsible-section --> limel-icon
  limel-collapsible-section --> limel-icon-button
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-switch --> limel-dynamic-label
  limel-switch --> limel-helper-line
  limel-dynamic-label --> limel-icon
  style limel-example-dialog-nested-close-events fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
