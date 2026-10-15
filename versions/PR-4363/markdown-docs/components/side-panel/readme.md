
<!-- Auto Generated Below -->


## Overview

A resizable panel that is displayed on top of the right side of the page.
The content is placed in the default slot, below a toolbar with a close button.

The panel is positioned relative to its nearest positioned ancestor. Set
`position: relative` on that element. Use `--side-panel-top-inset`,
`--side-panel-right-inset` and `--side-panel-bottom-inset` to keep parts of
that element visible, for example a header.

The CSS custom properties can be set on the panel or on any ancestor.

## Closing

The `close` event is emitted when the user clicks the close button, or presses
Escape anywhere on the page. The panel does not remove itself. The consumer
must remove it from the DOM.

An Escape keydown event with `defaultPrevented` set does not emit `close`.
This lets a popover or dropdown inside the panel handle Escape without
closing the panel. `limel-dialog` does not prevent the event yet, so Escape in
a dialog inside the panel also closes the panel. The panel listens on `window`, so it receives the
event after all listeners on elements and on `document`.

When more than one side panel is open, Escape closes only the panel that was
opened last.

`close` and `changeWidth` events from the slotted content do not propagate
past the panel. This prevents a consumer from mistaking them for events
emitted by the panel.

## Width

The panel starts with the width from `--side-panel-width`. The user can
resize the panel by dragging its left edge. The user can also use the
keyboard. When the handle has focus, ArrowLeft makes the panel wider and
ArrowRight makes it narrower.

The panel keeps the new width itself. While the panel exists, this width wins
over `--side-panel-width`. The width is limited by `--side-panel-min-width`
and the available space.

When the user releases the handle, or presses an arrow key, the panel emits
`changeWidth` with the new width in pixels. It does not emit the event when
the width did not change. The consumer does not have to handle the event. To keep the width
for the next time the panel opens, for example across sessions, store the
value. Then set it with `--side-panel-width` before the panel opens.

## Properties

| Property      | Attribute      | Description                                                                    | Type     | Default    |
| ------------- | -------------- | ------------------------------------------------------------------------------ | -------- | ---------- |
| `closeLabel`  | `close-label`  | Label of the close button. Shown as a tooltip and used as the accessible name. | `string` | `'Close'`  |
| `resizeLabel` | `resize-label` | Label of the resize handle. Used as the accessible name.                       | `string` | `'Resize'` |


## Events

| Event         | Description                                                                                                                                                                                                                                    | Type                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `changeWidth` | Emitted when the user has finished a resize that changed the width. The detail is the new width in pixels. The panel already uses the new width. Store the value to restore the width with `--side-panel-width` the next time the panel opens. | `CustomEvent<number>` |
| `close`       | Emitted when the close button is clicked, or when Escape is pressed.                                                                                                                                                                           | `CustomEvent<void>`   |


## Dependencies

### Used by

 - [limel-example-side-panel-basic](examples)
 - [limel-example-side-panel-insets](examples)

### Depends on

- [limel-icon](../icon)
- [limel-tooltip](../tooltip)
- [limel-resize-handle](../resize-handle)

### Graph
```mermaid
graph TD;
  limel-side-panel --> limel-icon
  limel-side-panel --> limel-tooltip
  limel-side-panel --> limel-resize-handle
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-example-side-panel-basic --> limel-side-panel
  limel-example-side-panel-insets --> limel-side-panel
  style limel-side-panel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
