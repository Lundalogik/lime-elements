
<!-- Auto Generated Below -->


## Overview

Stacking

Open a panel from inside the panel to make a stack. The last entry of
`stack` is the panel that is shown. The other entries are shown as backs
behind its left edge. Point at a back to see its heading.

Click a back to go back to it. The panel emits `selectStackEntry` with the
index of the entry in `stack`, and the example removes all entries after it.

In this example, `close` goes back one step. Another application could close
all panels instead.

## Dependencies

### Depends on

- [limel-button](../../button)
- [limel-side-panel](..)

### Graph
```mermaid
graph TD;
  limel-example-side-panel-stacking --> limel-button
  limel-example-side-panel-stacking --> limel-side-panel
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-side-panel --> limel-icon
  limel-side-panel --> limel-tooltip
  limel-side-panel --> limel-header
  limel-side-panel --> limel-resize-handle
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-header --> limel-icon
  style limel-example-side-panel-stacking fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
