
<!-- Auto Generated Below -->


## Overview

With actions
You can include a single action button inside the snackbar.

:::important
Keep in mind that pressing the action button will close
the snackbar immediately. The user must be informed that their
requested action actually took place. If there is no instant
visual feedback (for sighted users) in the user interface that
informs the user about the updated state, displaying another
snackbar could be a good idea.
:::

## Dependencies

### Depends on

- [limel-button](../../button)
- [limel-snackbar](..)

### Graph
```mermaid
graph TD;
  limel-example-snackbar-with-action --> limel-button
  limel-example-snackbar-with-action --> limel-snackbar
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-snackbar --> limel-markdown
  limel-snackbar --> limel-button
  limel-snackbar --> limel-icon-button
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  style limel-example-snackbar-with-action fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
