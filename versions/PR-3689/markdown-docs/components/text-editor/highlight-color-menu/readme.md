
<!-- Auto Generated Below -->


## Overview

This component is a menu for selecting highlight color in the text editor.
It allows the user to choose a color for text highlighting.

## Properties

| Property   | Attribute  | Description                            | Type                                                                   | Default     |
| ---------- | ---------- | -------------------------------------- | ---------------------------------------------------------------------- | ----------- |
| `color`    | `color`    | The selected color                     | `string`                                                               | `'#fff176'` |
| `language` | `language` | Defines the language for translations. | `"da" \| "de" \| "en" \| "fi" \| "fr" \| "nb" \| "nl" \| "no" \| "sv"` | `'en'`      |


## Events

| Event    | Description                                                            | Type                  |
| -------- | ---------------------------------------------------------------------- | --------------------- |
| `cancel` | Emitted when the menu is closed from inside the component.             | `CustomEvent<void>`   |
| `save`   | Emitted with the picked color. Picking a color applies it immediately. | `CustomEvent<string>` |


## Dependencies

### Used by

 - [limel-example-highlight-color-menu](examples)
 - [limel-prosemirror-adapter](../prosemirror-adapter)

### Depends on

- [limel-color-picker](../../color-picker)

### Graph
```mermaid
graph TD;
  limel-text-editor-highlight-color-menu --> limel-color-picker
  limel-color-picker --> limel-tooltip
  limel-color-picker --> limel-popover
  limel-color-picker --> limel-color-picker-palette
  limel-color-picker --> limel-input-field
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-color-picker-palette --> limel-input-field
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-example-highlight-color-menu --> limel-text-editor-highlight-color-menu
  limel-prosemirror-adapter --> limel-text-editor-highlight-color-menu
  style limel-text-editor-highlight-color-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
