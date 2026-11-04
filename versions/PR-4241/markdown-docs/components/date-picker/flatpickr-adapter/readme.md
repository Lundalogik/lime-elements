
<!-- Auto Generated Below -->


## Overview

This component is internal and only supposed to be used by
the limel-date-picker. This component is needed in order for us
to render the flatpickr calendar in a portal.

## Properties

| Property       | Attribute  | Description                                                                                                            | Type                                                                         | Default      |
| -------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------ |
| `format`       | `format`   | Format to display the selected date in.                                                                                | `string`                                                                     | `undefined`  |
| `inputElement` | --         | The input the user types into. Setting it creates the calendar.                                                        | `HTMLElement`                                                                | `undefined`  |
| `isOpen`       | `is-open`  | Set to `true` if the calendar should be open.                                                                          | `boolean`                                                                    | `undefined`  |
| `language`     | `language` | Defines the localisation for translations and date formatting. Property `format` customizes the localized date format. | `"da" \| "de" \| "en" \| "fi" \| "fr" \| "nb" \| "nl" \| "no" \| "sv"`       | `'en'`       |
| `previewValue` | --         | Shown as selected instead of `value` while set.                                                                        | `Date`                                                                       | `undefined`  |
| `type`         | `type`     | Type of date picker.                                                                                                   | `"date" \| "datetime" \| "month" \| "quarter" \| "time" \| "week" \| "year"` | `'datetime'` |
| `value`        | --         | The value of the field.                                                                                                | `Date`                                                                       | `undefined`  |


## Events

| Event    | Description                                    | Type                |
| -------- | ---------------------------------------------- | ------------------- |
| `change` | Emitted when the date picker value is changed. | `CustomEvent<Date>` |


## Methods

### `focusDay() => Promise<boolean>`

Moves focus to the selected day, else today, else the first day of
the month.

#### Returns

Type: `Promise<boolean>`

`false` when the calendar has no day grid


## Dependencies

### Used by

 - [limel-date-picker](..)

### Graph
```mermaid
graph TD;
  limel-date-picker --> limel-flatpickr-adapter
  style limel-flatpickr-adapter fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
