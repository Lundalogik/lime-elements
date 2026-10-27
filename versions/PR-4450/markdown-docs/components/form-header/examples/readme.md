
<!-- Auto Generated Below -->


## Overview

Help
A string is used as the `value` of the help. To change anything else of
the help, such as the "Read more" link, give an object with the properties
of [limel-help](#/component/limel-help/).

## Dependencies

### Depends on

- [limel-form-header](..)

### Graph
```mermaid
graph TD;
  limel-example-form-header-help --> limel-form-header
  limel-form-header --> limel-help
  limel-form-header --> limel-markdown
  limel-help --> limel-popover
  limel-help --> limel-help-content
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-help-content --> limel-markdown
  style limel-example-form-header-help fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
