
<!-- Auto Generated Below -->


## Overview

Nesting a component in the card
You can nest any component inside the card, to provide a more complex
and interactive experience to the user.

## Dependencies

### Depends on

- [limel-card](..)
- [limel-example-card-nested-component](.)

### Graph
```mermaid
graph TD;
  limel-example-card-slot --> limel-card
  limel-example-card-slot --> limel-example-card-nested-component
  limel-card --> limel-3d-hover-effect-glow
  limel-card --> limel-icon
  limel-card --> limel-markdown
  limel-card --> limel-action-bar
  limel-action-bar --> limel-action-bar-item
  limel-action-bar --> limel-action-bar-overflow-menu
  limel-action-bar --> limel-icon
  limel-action-bar --> limel-tooltip
  limel-action-bar-item --> limel-icon
  limel-action-bar-item --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-action-bar-overflow-menu --> limel-icon
  limel-action-bar-overflow-menu --> limel-menu
  limel-menu --> limel-spinner
  limel-menu --> limel-breadcrumbs
  limel-menu --> limel-input-field
  limel-menu --> limel-menu-list
  limel-menu --> limel-badge
  limel-menu --> limel-portal
  limel-menu --> limel-menu-surface
  limel-breadcrumbs --> limel-icon
  limel-breadcrumbs --> limel-tooltip
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-example-card-nested-component --> limel-slider
  limel-example-card-nested-component --> limel-action-bar
  limel-slider --> limel-helper-line
  limel-slider --> limel-notched-outline
  style limel-example-card-slot fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
