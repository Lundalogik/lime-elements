# limel-prosemirror-adapter



<!-- Auto Generated Below -->


## Overview

The ProseMirror adapter offers a rich text editing experience with markdown support.
[Read more...](https://prosemirror.net/)

## Properties

| Property            | Attribute      | Description                                                                                                                                                                                                                             | Type                                                                   | Default      |
| ------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------ |
| `contentType`       | `content-type` | The type of content that the editor should handle and emit, defaults to `markdown`  Assumed to be set only once, so not reactive to changes                                                                                             | `"html" \| "markdown"`                                                 | `'markdown'` |
| `customElements`    | --             | set to private to avoid usage while under development                                                                                                                                                                                   | `CustomElementDefinition[]`                                            | `[]`         |
| `disabled`          | `disabled`     | Set to `true` to disable the field. Use `disabled` to indicate that the field can normally be interacted with, but is currently disabled. This tells the user that if certain requirements are met, the field may become enabled again. | `boolean`                                                              | `false`      |
| `language`          | `language`     | Defines the language for translations.                                                                                                                                                                                                  | `"da" \| "de" \| "en" \| "fi" \| "fr" \| "nb" \| "nl" \| "no" \| "sv"` | `undefined`  |
| `triggerCharacters` | --             | set to private to avoid usage while under development                                                                                                                                                                                   | `TriggerCharacter[]`                                                   | `[]`         |
| `ui`                | `ui`           | Specifies the visual appearance of the editor.                                                                                                                                                                                          | `"minimal" \| "no-toolbar" \| "standard"`                              | `'standard'` |
| `value`             | `value`        | The value of the editor, expected to be markdown                                                                                                                                                                                        | `string`                                                               | `undefined`  |


## Events

| Event            | Description                                                           | Type                          |
| ---------------- | --------------------------------------------------------------------- | ----------------------------- |
| `change`         | Dispatched when a change is made to the editor                        | `CustomEvent<string>`         |
| `imagePasted`    | Dispatched when a image is pasted into the editor                     | `CustomEvent<ImageInserter>`  |
| `imageRemoved`   | Dispatched when a image is removed from the editor                    | `CustomEvent<EditorImage>`    |
| `metadataChange` | Dispatched when the metadata of the editor changes (images and links) | `CustomEvent<EditorMetadata>` |


## Dependencies

### Used by

 - [limel-example-prosemirror-adapter-basic](examples)
 - [limel-example-prosemirror-adapter-with-custom-menu](examples)
 - [limel-text-editor](..)

### Depends on

- [limel-action-bar](../../action-bar)
- [limel-portal](../../portal)
- [limel-text-editor-link-menu](../link-menu)

### Graph
```mermaid
graph TD;
  limel-prosemirror-adapter --> limel-action-bar
  limel-prosemirror-adapter --> limel-portal
  limel-prosemirror-adapter --> limel-text-editor-link-menu
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
  limel-text-editor-link-menu --> limel-input-field
  limel-text-editor-link-menu --> limel-button
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-example-prosemirror-adapter-basic --> limel-prosemirror-adapter
  limel-example-prosemirror-adapter-with-custom-menu --> limel-prosemirror-adapter
  limel-text-editor --> limel-prosemirror-adapter
  style limel-prosemirror-adapter fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
