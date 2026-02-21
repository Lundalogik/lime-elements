
<!-- Auto Generated Below -->


## Overview

The `limel-example-value` component is a utility component
used internally in the Lime Elements documentation to display
property values and component states in a formatted way.

## Purpose
This component helps visualize different types of values in
our component examples and documentation.
It's particularly useful for:
- Displaying primitive values
- Formatting dates
- Pretty-printing objects and arrays
- Showing undefined values

## Usage
```tsx
<limel-example-value label="Selected item" value={this.selectedItem} />
```

Display Formatting
The component automatically formats different value types:
- `undefined` values are displayed as `undefined`
- `Date` objects are converted to strings using `toString()`
- Objects and arrays are pretty-printed using `JSON.stringify` with indentation
- Primitive values are displayed within `<code>` tags.

## Properties

| Property | Attribute | Description                         | Type     | Default     |
| -------- | --------- | ----------------------------------- | -------- | ----------- |
| `label`  | `label`   | A label describing the value.       | `string` | `'Value'`   |
| `value`  | `value`   | The value that should be displayed. | `any`    | `undefined` |


## Dependencies

### Used by

 - [limel-example-breadcrumbs-buttons](../components/breadcrumbs/examples)
 - [limel-example-builtin-field-types-form](../components/form/examples)
 - [limel-example-chart-clickable-items](../components/chart/examples)
 - [limel-example-checkbox](../components/checkbox/examples)
 - [limel-example-checkbox-readonly](../components/checkbox/examples)
 - [limel-example-chip-menu](../components/chip/examples)
 - [limel-example-chip-removable](../components/chip/examples)
 - [limel-example-chip-set-input](../components/chip-set/examples)
 - [limel-example-chip-set-input-type-with-menu-items](../components/chip-set/examples)
 - [limel-example-code-editor-composite](../components/code-editor/examples)
 - [limel-example-custom-component-form](../components/form/examples)
 - [limel-example-date-picker-custom-formatter](../components/date-picker/examples)
 - [limel-example-date-picker-date](../components/date-picker/examples)
 - [limel-example-date-picker-datetime](../components/date-picker/examples)
 - [limel-example-date-picker-formatted](../components/date-picker/examples)
 - [limel-example-date-picker-month](../components/date-picker/examples)
 - [limel-example-date-picker-programmatic-change](../components/date-picker/examples)
 - [limel-example-date-picker-quarter](../components/date-picker/examples)
 - [limel-example-date-picker-time](../components/date-picker/examples)
 - [limel-example-date-picker-week](../components/date-picker/examples)
 - [limel-example-date-picker-year](../components/date-picker/examples)
 - [limel-example-dynamic-form](../components/form/examples)
 - [limel-example-dynamic-label](../components/dynamic-label/examples)
 - [limel-example-dynamic-label-readonly-boolean](../components/dynamic-label/examples)
 - [limel-example-file](../components/file/examples)
 - [limel-example-file-custom-icon](../components/file/examples)
 - [limel-example-file-dropzone](../components/file-dropzone/examples)
 - [limel-example-file-dropzone-type-filtering](../components/file-dropzone/examples)
 - [limel-example-file-input](../components/file-input/examples)
 - [limel-example-file-input-type-filtering](../components/file-input/examples)
 - [limel-example-file-menu-items](../components/file/examples)
 - [limel-example-form](../components/form/examples)
 - [limel-example-form-array-item-controls](../components/form/examples)
 - [limel-example-form-with-help](../components/form/examples)
 - [limel-example-hotkey-basic](../components/hotkey/examples)
 - [limel-example-hotkey-disabled](../components/hotkey/examples)
 - [limel-example-hotkey-duplicates](../components/hotkey/examples)
 - [limel-example-input-field-autocomplete](../components/input-field/examples)
 - [limel-example-input-field-number](../components/input-field/examples)
 - [limel-example-input-field-showlink](../components/input-field/examples)
 - [limel-example-input-field-text](../components/input-field/examples)
 - [limel-example-input-field-textarea](../components/input-field/examples)
 - [limel-example-list-action](../components/list/examples)
 - [limel-example-list-checkbox-icons](../components/list/examples)
 - [limel-example-list-form](../components/form/examples)
 - [limel-example-list-item-actions](../components/list-item/examples)
 - [limel-example-list-item-checkbox](../components/list-item/examples)
 - [limel-example-list-item-interactive](../components/list-item/examples)
 - [limel-example-list-item-radio](../components/list-item/examples)
 - [limel-example-list-radio-button-icons](../components/list/examples)
 - [limel-example-list-selectable](../components/list/examples)
 - [limel-example-menu-basic](../components/menu/examples)
 - [limel-example-menu-hotkeys](../components/menu/examples)
 - [limel-example-menu-open-sub-menu-programmatically](../components/menu/examples)
 - [limel-example-menu-searchable](../components/menu/examples)
 - [limel-example-menu-secondary-text](../components/menu/examples)
 - [limel-example-menu-separators](../components/menu/examples)
 - [limel-example-menu-sub-menu-lazy-loading](../components/menu/examples)
 - [limel-example-menu-sub-menu-lazy-loading-infinite](../components/menu/examples)
 - [limel-example-menu-sub-menus](../components/menu/examples)
 - [limel-example-nested-form](../components/form/examples)
 - [limel-example-notched-outline-basic](../components/notched-outline/examples)
 - [limel-example-picker-basic](../components/picker/examples)
 - [limel-example-picker-empty-suggestions](../components/picker/examples)
 - [limel-example-picker-icons](../components/picker/examples)
 - [limel-example-picker-multiple](../components/picker/examples)
 - [limel-example-picker-pictures](../components/picker/examples)
 - [limel-example-picker-static-actions](../components/picker/examples)
 - [limel-example-picker-value-as-object](../components/picker/examples)
 - [limel-example-picker-value-as-object-with-actions](../components/picker/examples)
 - [limel-example-profile-picture-basic](../components/profile-picture/examples)
 - [limel-example-profile-picture-helper-text](../components/profile-picture/examples)
 - [limel-example-profile-picture-icon](../components/profile-picture/examples)
 - [limel-example-profile-picture-resize-contain](../components/profile-picture/examples)
 - [limel-example-profile-picture-resize-cover](../components/profile-picture/examples)
 - [limel-example-profile-picture-resize-fallback](../components/profile-picture/examples)
 - [limel-example-profile-picture-styling](../components/profile-picture/examples)
 - [limel-example-profile-picture-with-value](../components/profile-picture/examples)
 - [limel-example-progress-flow-basic](../components/progress-flow/examples)
 - [limel-example-props-factory-form](../components/form/examples)
 - [limel-example-prosemirror-adapter-basic](../components/text-editor/prosemirror-adapter/examples)
 - [limel-example-prosemirror-adapter-with-custom-menu](../components/text-editor/prosemirror-adapter/examples)
 - [limel-example-radio-button-group-basic](../components/radio-button-group/examples)
 - [limel-example-radio-button-group-deselect-selected](../components/radio-button-group/examples)
 - [limel-example-radio-button-group-icons](../components/radio-button-group/examples)
 - [limel-example-radio-button-group-multiple-lines](../components/radio-button-group/examples)
 - [limel-example-readonly-props](../design-guidelines/boolean/examples)
 - [limel-example-select](../components/select/examples)
 - [limel-example-select-change-options](../components/select/examples)
 - [limel-example-select-dialog](../components/select/examples)
 - [limel-example-select-multiple](../components/select/examples)
 - [limel-example-select-multiple-icons](../components/select/examples)
 - [limel-example-select-preselected](../components/select/examples)
 - [limel-example-select-with-empty-option](../components/select/examples)
 - [limel-example-select-with-icons](../components/select/examples)
 - [limel-example-select-with-secondary-text](../components/select/examples)
 - [limel-example-select-with-separators](../components/select/examples)
 - [limel-example-slider-basic](../components/slider/examples)
 - [limel-example-slider-multiplier](../components/slider/examples)
 - [limel-example-slider-multiplier-percentage-colors](../components/slider/examples)
 - [limel-example-switch](../components/switch/examples)
 - [limel-example-switch-helper-text](../components/switch/examples)
 - [limel-example-switch-readonly](../components/switch/examples)
 - [limel-example-tab-bar](../components/tab-bar/examples)
 - [limel-example-tab-bar-with-dynamic-tab-width](../components/tab-bar/examples)
 - [limel-example-tab-bar-with-equal-tab-width](../components/tab-bar/examples)
 - [limel-example-table-activate-row](../components/table/examples)
 - [limel-example-table-local](../components/table/examples)
 - [limel-example-table-movable-columns](../components/table/examples)
 - [limel-example-table-selectable-rows](../components/table/examples)
 - [limel-example-text-editor-allow-resize](../components/text-editor/examples)
 - [limel-example-text-editor-as-form-component](../components/text-editor/examples)
 - [limel-example-text-editor-basic](../components/text-editor/examples)
 - [limel-example-text-editor-composite](../components/text-editor/examples)
 - [limel-example-text-editor-custom-element](../components/text-editor/examples)
 - [limel-example-text-editor-triggers](../components/text-editor/examples)
 - [limel-example-text-editor-ui](../components/text-editor/examples)
 - [limel-example-text-editor-with-html](../components/text-editor/examples)
 - [limel-example-text-editor-with-inline-images-file-storage](../components/text-editor/examples)
 - [limel-example-text-editor-with-markdown](../components/text-editor/examples)
 - [limel-example-text-editor-with-tables](../components/text-editor/examples)

### Graph
```mermaid
graph TD;
  limel-example-breadcrumbs-buttons --> limel-example-value
  limel-example-builtin-field-types-form --> limel-example-value
  limel-example-chart-clickable-items --> limel-example-value
  limel-example-checkbox --> limel-example-value
  limel-example-checkbox-readonly --> limel-example-value
  limel-example-chip-menu --> limel-example-value
  limel-example-chip-removable --> limel-example-value
  limel-example-chip-set-input --> limel-example-value
  limel-example-chip-set-input-type-with-menu-items --> limel-example-value
  limel-example-code-editor-composite --> limel-example-value
  limel-example-custom-component-form --> limel-example-value
  limel-example-date-picker-custom-formatter --> limel-example-value
  limel-example-date-picker-date --> limel-example-value
  limel-example-date-picker-datetime --> limel-example-value
  limel-example-date-picker-formatted --> limel-example-value
  limel-example-date-picker-month --> limel-example-value
  limel-example-date-picker-programmatic-change --> limel-example-value
  limel-example-date-picker-quarter --> limel-example-value
  limel-example-date-picker-time --> limel-example-value
  limel-example-date-picker-week --> limel-example-value
  limel-example-date-picker-year --> limel-example-value
  limel-example-dynamic-form --> limel-example-value
  limel-example-dynamic-label --> limel-example-value
  limel-example-dynamic-label-readonly-boolean --> limel-example-value
  limel-example-file --> limel-example-value
  limel-example-file-custom-icon --> limel-example-value
  limel-example-file-dropzone --> limel-example-value
  limel-example-file-dropzone-type-filtering --> limel-example-value
  limel-example-file-input --> limel-example-value
  limel-example-file-input-type-filtering --> limel-example-value
  limel-example-file-menu-items --> limel-example-value
  limel-example-form --> limel-example-value
  limel-example-form-array-item-controls --> limel-example-value
  limel-example-form-with-help --> limel-example-value
  limel-example-hotkey-basic --> limel-example-value
  limel-example-hotkey-disabled --> limel-example-value
  limel-example-hotkey-duplicates --> limel-example-value
  limel-example-input-field-autocomplete --> limel-example-value
  limel-example-input-field-number --> limel-example-value
  limel-example-input-field-showlink --> limel-example-value
  limel-example-input-field-text --> limel-example-value
  limel-example-input-field-textarea --> limel-example-value
  limel-example-list-action --> limel-example-value
  limel-example-list-checkbox-icons --> limel-example-value
  limel-example-list-form --> limel-example-value
  limel-example-list-item-actions --> limel-example-value
  limel-example-list-item-checkbox --> limel-example-value
  limel-example-list-item-interactive --> limel-example-value
  limel-example-list-item-radio --> limel-example-value
  limel-example-list-radio-button-icons --> limel-example-value
  limel-example-list-selectable --> limel-example-value
  limel-example-menu-basic --> limel-example-value
  limel-example-menu-hotkeys --> limel-example-value
  limel-example-menu-open-sub-menu-programmatically --> limel-example-value
  limel-example-menu-searchable --> limel-example-value
  limel-example-menu-secondary-text --> limel-example-value
  limel-example-menu-separators --> limel-example-value
  limel-example-menu-sub-menu-lazy-loading --> limel-example-value
  limel-example-menu-sub-menu-lazy-loading-infinite --> limel-example-value
  limel-example-menu-sub-menus --> limel-example-value
  limel-example-nested-form --> limel-example-value
  limel-example-notched-outline-basic --> limel-example-value
  limel-example-picker-basic --> limel-example-value
  limel-example-picker-empty-suggestions --> limel-example-value
  limel-example-picker-icons --> limel-example-value
  limel-example-picker-multiple --> limel-example-value
  limel-example-picker-pictures --> limel-example-value
  limel-example-picker-static-actions --> limel-example-value
  limel-example-picker-value-as-object --> limel-example-value
  limel-example-picker-value-as-object-with-actions --> limel-example-value
  limel-example-profile-picture-basic --> limel-example-value
  limel-example-profile-picture-helper-text --> limel-example-value
  limel-example-profile-picture-icon --> limel-example-value
  limel-example-profile-picture-resize-contain --> limel-example-value
  limel-example-profile-picture-resize-cover --> limel-example-value
  limel-example-profile-picture-resize-fallback --> limel-example-value
  limel-example-profile-picture-styling --> limel-example-value
  limel-example-profile-picture-with-value --> limel-example-value
  limel-example-progress-flow-basic --> limel-example-value
  limel-example-props-factory-form --> limel-example-value
  limel-example-prosemirror-adapter-basic --> limel-example-value
  limel-example-prosemirror-adapter-with-custom-menu --> limel-example-value
  limel-example-radio-button-group-basic --> limel-example-value
  limel-example-radio-button-group-deselect-selected --> limel-example-value
  limel-example-radio-button-group-icons --> limel-example-value
  limel-example-radio-button-group-multiple-lines --> limel-example-value
  limel-example-readonly-props --> limel-example-value
  limel-example-select --> limel-example-value
  limel-example-select-change-options --> limel-example-value
  limel-example-select-dialog --> limel-example-value
  limel-example-select-multiple --> limel-example-value
  limel-example-select-multiple-icons --> limel-example-value
  limel-example-select-preselected --> limel-example-value
  limel-example-select-with-empty-option --> limel-example-value
  limel-example-select-with-icons --> limel-example-value
  limel-example-select-with-secondary-text --> limel-example-value
  limel-example-select-with-separators --> limel-example-value
  limel-example-slider-basic --> limel-example-value
  limel-example-slider-multiplier --> limel-example-value
  limel-example-slider-multiplier-percentage-colors --> limel-example-value
  limel-example-switch --> limel-example-value
  limel-example-switch-helper-text --> limel-example-value
  limel-example-switch-readonly --> limel-example-value
  limel-example-tab-bar --> limel-example-value
  limel-example-tab-bar-with-dynamic-tab-width --> limel-example-value
  limel-example-tab-bar-with-equal-tab-width --> limel-example-value
  limel-example-table-activate-row --> limel-example-value
  limel-example-table-local --> limel-example-value
  limel-example-table-movable-columns --> limel-example-value
  limel-example-table-selectable-rows --> limel-example-value
  limel-example-text-editor-allow-resize --> limel-example-value
  limel-example-text-editor-as-form-component --> limel-example-value
  limel-example-text-editor-basic --> limel-example-value
  limel-example-text-editor-composite --> limel-example-value
  limel-example-text-editor-custom-element --> limel-example-value
  limel-example-text-editor-triggers --> limel-example-value
  limel-example-text-editor-ui --> limel-example-value
  limel-example-text-editor-with-html --> limel-example-value
  limel-example-text-editor-with-inline-images-file-storage --> limel-example-value
  limel-example-text-editor-with-markdown --> limel-example-value
  limel-example-text-editor-with-tables --> limel-example-value
  style limel-example-value fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
