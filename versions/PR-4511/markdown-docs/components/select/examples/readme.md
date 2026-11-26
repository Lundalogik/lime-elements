
<!-- Auto Generated Below -->


## Overview

Select with secondary text for options
Using a `secondaryText` you can provide additional information about
each option in the list, helping the users to select the right choice.

:::note
1. The secondary text is only visible in the dropdown list,
not on the selected option in the input field.
1. Additionally, on touch screen devices, the secondary text will not
be visible in the dropdown list, since the component uses the "native"
select, which does not have support for additional features like this,
or displaying icons beside the options.
:::

## Dependencies

### Depends on

- [limel-select](..)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-select-with-secondary-text --> limel-select
  limel-example-select-with-secondary-text --> limel-example-value
  limel-select --> limel-notched-outline
  limel-select --> limel-icon
  limel-select --> limel-helper-line
  limel-select --> limel-portal
  limel-select --> limel-menu-surface
  limel-select --> limel-list
  style limel-example-select-with-secondary-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
