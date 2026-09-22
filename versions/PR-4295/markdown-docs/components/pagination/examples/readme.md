
<!-- Auto Generated Below -->


## Overview

Total items

`totalItems` is how many items there are in total, across every page. It is
the only number the component needs to know how far the set goes.

Some apps fetch the items first and the total count a moment later, so that
the list appears sooner. If that is you, set `totalItems` to `null` until the
count turns up.

This example pretends to be such an app. Press the button and watch the order
things happen in: the items come back first, and the count a moment later.
While the count is missing the component keeps the pages it already knew
about, so nothing jumps around and you stay on the page you were on.

Going to another page only fetches the items. The count is still good, so the
page numbers do not flicker.

A small total is worth knowing about: when everything fits on one page, the
component still renders, showing `1` with both arrows dead. It stays because
disappearing would shove whatever sits underneath it upwards, at the
unhelpful moment when a filter has just narrowed someone's results. Whether
a pagination is worth showing at all in that case is your call, and you make
it by not rendering one.

## Dependencies

### Depends on

- [limel-pagination](..)
- [limel-example-value](../../../examples)
- [limel-example-controls](../../../examples)
- [limel-button](../../button)

### Graph
```mermaid
graph TD;
  limel-example-pagination-total-items --> limel-pagination
  limel-example-pagination-total-items --> limel-example-value
  limel-example-pagination-total-items --> limel-example-controls
  limel-example-pagination-total-items --> limel-button
  limel-pagination --> limel-popover
  limel-pagination --> limel-pagination-jump
  limel-pagination --> limel-spinner
  limel-pagination --> limel-tooltip
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-pagination-jump --> limel-input-field
  limel-pagination-jump --> limel-button
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  style limel-example-pagination-total-items fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
