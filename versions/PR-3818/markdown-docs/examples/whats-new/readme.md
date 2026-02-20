
<!-- Auto Generated Below -->


## Overview

This component is used in our library documentation to showcase single component examples.

## Properties

| Property        | Attribute        | Description                                                                                                                     | Type                                   | Default     |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `componentName` | `component-name` | The name of the component being showcased. The card will generate a link to the component documentation based on this name.     | `string`                               | `undefined` |
| `description`   | `description`    | A short description of the showcased feature                                                                                    | `string`                               | `undefined` |
| `heading`       | `heading`        | The main heading of the card                                                                                                    | `string`                               | `undefined` |
| `releaseDate`   | `release-date`   | The date of the version release                                                                                                 | `string`                               | `undefined` |
| `type`          | `type`           | The type of update being showcased                                                                                              | `"bugfix" \| "component" \| "feature"` | `'feature'` |
| `version`       | `version`        | The version number for the release (e.g. "38.28.0"). The card will prefix it with a leading 'v' and link to the GitHub release. | `string`                               | `undefined` |


## Dependencies

### Used by

 - [limel-example-whats-new](.)

### Depends on

- [limel-badge](../../components/badge)
- [limel-markdown](../../components/markdown)
- [limel-chip](../../components/chip)

### Graph
```mermaid
graph TD;
  limel-showcase-card --> limel-badge
  limel-showcase-card --> limel-markdown
  limel-showcase-card --> limel-chip
  limel-chip --> limel-icon
  limel-chip --> limel-badge
  limel-chip --> limel-menu
  limel-chip --> limel-linear-progress
  limel-menu --> limel-spinner
  limel-menu --> limel-breadcrumbs
  limel-menu --> limel-input-field
  limel-menu --> limel-menu-list
  limel-menu --> limel-badge
  limel-menu --> limel-portal
  limel-menu --> limel-menu-surface
  limel-breadcrumbs --> limel-icon
  limel-breadcrumbs --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-example-whats-new --> limel-showcase-card
  style limel-showcase-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
