
<!-- Auto Generated Below -->


## Overview

Input chip set with `inputType` of `text`

There is a slight difference in the way browsers treat `input` field
with `type="text"` and `type="search"`. You can read more about this
difference in [Mozilla's documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search#using_search_inputs),
but the most important difference in this case is activation of the
autocorrection feature on most smart devices.

When a user makes a spelling mistake while typing in an input field with
`type="text"`, the mistake will be corrected automatically, right after they
press <kbd>Enter</kbd> or <kbd>Space</kbd>. Input fields with `type="search"`
do not auto correct the user's input.

If you want to use limel-chip-set in a form context, where autocorrection is
a good thing, use `text` as `inputType`. It is important to know that the
chip-set component creates a chip from the autocorrected value, after the
user has pressed the <kbd>Enter</kbd> key and the auto correction has fixed
existing typos! For example, for a question like "Please type five of your
favorite fruits", you would want to avoid misspellings, to collect higher
quality data.

## Dependencies

### Depends on

- [limel-chip-set](..)

### Graph
```mermaid
graph TD;
  limel-example-chip-set-input-type-text --> limel-chip-set
  limel-chip-set --> limel-helper-line
  limel-chip-set --> limel-notched-outline
  limel-chip-set --> limel-chip
  limel-chip-set --> limel-icon
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
  style limel-example-chip-set-input-type-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
