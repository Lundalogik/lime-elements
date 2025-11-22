
<!-- Auto Generated Below -->


## Overview

Card is a component that displays content about a single topic,
in a structured way. It can contain a header, and some supporting media such
as an image or an icon, a body of text, or optional actions.

## Properties

| Property      | Attribute     | Description                                                                                                     | Type                                 | Default      |
| ------------- | ------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------ |
| `actions`     | `actions`     | Actions to display in the card, to provide the user with options to interact with the content.                  | `(ListSeparator \| ActionBarItem)[]` | `[]`         |
| `clickable`   | `clickable`   | When true, improve the accessibility of the component and hints the user that the card can be interacted width. | `boolean`                            | `false`      |
| `heading`     | `heading`     | Heading of the card, to provide a short title about the context.                                                | `string`                             | `undefined`  |
| `icon`        | `icon`        | An icon, to display along with the heading and subheading.                                                      | `Icon \| string`                     | `undefined`  |
| `image`       | `image`       | A hero image to display in the card, to enrich the content with visual information.                             | `Image`                              | `undefined`  |
| `orientation` | `orientation` | The orientation of the card, specially useful when the card has an image.                                       | `"landscape" \| "portrait"`          | `'portrait'` |
| `subheading`  | `subheading`  | Subheading of the card to provide a short description of the context.                                           | `string`                             | `undefined`  |
| `value`       | `value`       | The content of the card. Supports markdown, to provide a rich text experience.                                  | `string`                             | `undefined`  |


## Events

| Event            | Description                                    | Type                                                                     |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| `actionSelected` | Fired when a action bar item has been clicked. | `CustomEvent<ActionBarItemOnlyIcon<any> \| ActionBarItemWithLabel<any>>` |


## Dependencies

### Used by

 - [limel-example-card-actions](examples)
 - [limel-example-card-basic](examples)
 - [limel-example-card-clickable](examples)
 - [limel-example-card-image](examples)
 - [limel-example-card-orientation](examples)
 - [limel-example-card-slot](examples)
 - [limel-example-card-styling](examples)
 - [limel-example-popover-styling](../popover/examples)

### Depends on

- [limel-3d-hover-effect-glow](../3d-hover-effect-glow)
- [limel-icon](../icon)
- [limel-markdown](../markdown)
- [limel-action-bar](../action-bar)

### Graph
```mermaid
graph TD;
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
  limel-example-card-actions --> limel-card
  limel-example-card-basic --> limel-card
  limel-example-card-clickable --> limel-card
  limel-example-card-image --> limel-card
  limel-example-card-orientation --> limel-card
  limel-example-card-slot --> limel-card
  limel-example-card-styling --> limel-card
  limel-example-popover-styling --> limel-card
  style limel-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
