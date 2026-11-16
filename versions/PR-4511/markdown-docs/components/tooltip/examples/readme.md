
<!-- Auto Generated Below -->


## Overview

Composite

A place to try different combinations of states.

## Properties

| Property | Attribute | Description | Type              | Default     |
| -------- | --------- | ----------- | ----------------- | ----------- |
| `schema` | --        |             | `FormSchema<any>` | `undefined` |


## Dependencies

### Depends on

- [limel-button](../../button)
- [limel-tooltip](..)
- [limel-collapsible-section](../../collapsible-section)
- [limel-form](../../form)

### Graph
```mermaid
graph TD;
  limel-example-tooltip-composite --> limel-button
  limel-example-tooltip-composite --> limel-tooltip
  limel-example-tooltip-composite --> limel-collapsible-section
  limel-example-tooltip-composite --> limel-form
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-collapsible-section --> limel-icon
  limel-collapsible-section --> limel-icon-button
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-form --> limel-markdown
  limel-form --> limel-form-header
  limel-form --> limel-collapsible-section
  limel-form-header --> limel-help
  limel-form-header --> limel-markdown
  limel-help --> limel-popover
  limel-help --> limel-help-content
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-help-content --> limel-markdown
  style limel-example-tooltip-composite fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
