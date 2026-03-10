
<!-- Auto Generated Below -->


## Overview

Displays a visual diff between two text values, modeled on
GitHub's code difference view.

Supports unified and split (side-by-side) views with line numbers,
color-coded additions and removals, word-level inline highlighting,
and collapsible unchanged context sections.

## Properties

| Property       | Attribute       | Description                                                                                                                                                         | Type                          | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| `colorScheme`  | `color-scheme`  | Select color scheme for the diff viewer.                                                                                                                            | `"auto" \| "dark" \| "light"` | `'auto'`    |
| `contextLines` | `context-lines` | Number of unchanged context lines to display around each change.                                                                                                    | `number`                      | `3`         |
| `language`     | `language`      | Language for syntax highlighting. Currently supports `"json"`. When set, code tokens are colorized (strings, numbers, keys, etc.) alongside the diff highlighting.  | `string`                      | `undefined` |
| `lineWrap`     | `line-wrap`     | When `true`, long lines are wrapped instead of causing horizontal scrolling. Useful when comparing prose or config files with long values.                          | `boolean`                     | `false`     |
| `newHeader`    | `new-header`    | Label for the new (after) version, displayed in the diff header.                                                                                                    | `string`                      | `undefined` |
| `newValue`     | `new-value`     | The "after" value to compare. Can be a string or an object (which will be serialized to JSON).                                                                      | `object \| string`            | `''`        |
| `oldHeader`    | `old-header`    | Label for the old (before) version, displayed in the diff header.                                                                                                   | `string`                      | `undefined` |
| `oldValue`     | `old-value`     | The "before" value to compare. Can be a string or an object (which will be serialized to JSON).                                                                     | `object \| string`            | `''`        |
| `reformatJson` | `reformat-json` | When `true`, JSON values are parsed, keys are sorted, and indentation is normalized before diffing. This eliminates noise from formatting or key-order differences. | `boolean`                     | `false`     |
| `viewMode`     | `view-mode`     | The diff view mode. - `unified` — single column with interleaved additions and removals - `split` — side-by-side comparison with old on left, new on right          | `"split" \| "unified"`        | `'unified'` |


## Dependencies

### Used by

 - [limel-example-code-diff](examples)
 - [limel-example-code-diff-json](examples)
 - [limel-example-code-diff-line-wrap](examples)
 - [limel-example-code-diff-split](examples)

### Graph
```mermaid
graph TD;
  limel-example-code-diff --> limel-code-diff
  limel-example-code-diff-json --> limel-code-diff
  limel-example-code-diff-line-wrap --> limel-code-diff
  limel-example-code-diff-split --> limel-code-diff
  style limel-code-diff fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
