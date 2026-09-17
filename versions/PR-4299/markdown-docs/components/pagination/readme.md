
<!-- Auto Generated Below -->


## Overview

Pagination reports where the user is in a set of results, and allows them
to move somewhere else in it.

This component does not load anything on its own.
As a consumer, you give it a page and a total, and it emits the page
the user asked for — together with the `offset` and `limit` that page needs —
leaving the consumer to decide what that means.

:::note
Pagination does not decide how many items fit on a page. That is `pageSize`,
and it is yours to set, or a setting you let your users pick, next to your
other settings.
:::

Knowing where you are matters as much as being able to move. A page number
and a total tell people how much there is and how far into it they have got,
and hovering a page shows exactly which items it holds. A "load more" button
tells them none of that: there is no way to picture the set, or to know
whether pressing it again brings ten more items or ten thousand.

The component always renders, even when everything fits on one page and
there is nowhere to go. Hiding itself would move whatever sits below it at
the moment a filter happens to narrow the results, and the consumer could
not prevent that. Deciding not to render a pagination at all is a decision
only the consumer can make, so it is left to them.

Page 1 and the last page are always shown, so both ends of the list are one
click away. That is why there are no separate first and last buttons: the
numbers already do that job, and they say where they take you. When there are
more pages than fit, the ones left out are replaced by a `···`.

## Properties

| Property     | Attribute     | Description                                                                                       | Type                                                                   | Default |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------- |
| `language`   | `language`    | The language used for the labels and the tooltips, and for the way numbers are written.           | `"da" \| "de" \| "en" \| "fi" \| "fr" \| "nb" \| "nl" \| "no" \| "sv"` | `'en'`  |
| `loading`    | `loading`     | Set this to `true` while you are fetching a page.                                                 | `boolean`                                                              | `false` |
| `page`       | `page`        | Which page to show. The first page is `1`, not `0`.                                               | `number`                                                               | `1`     |
| `pageSize`   | `page-size`   | How many items fit on one page.                                                                   | `number`                                                               | `100`   |
| `totalItems` | `total-items` | How many items there are in total, across every page. `null` means the count has not arrived yet. | `number`                                                               | `null`  |


## Events

| Event        | Description                                                                                                                                                                                                                                                   | Type                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `changePage` | Emitted when the page changes, whether the user moved or the component had to move them. Clicking the page they are already on emits nothing.  Does not bubble, so that it cannot be mistaken for `limel-table`'s `changePage`, which carries a plain number. | `CustomEvent<ChangePageEvent>` |


## Dependencies

### Used by

 - [limel-example-pagination-basic](examples)
 - [limel-example-pagination-language](examples)
 - [limel-example-pagination-loading](examples)
 - [limel-example-pagination-page](examples)
 - [limel-example-pagination-page-size](examples)
 - [limel-example-pagination-total-items](examples)

### Depends on

- [limel-spinner](../spinner)
- [limel-tooltip](../tooltip)

### Graph
```mermaid
graph TD;
  limel-pagination --> limel-spinner
  limel-pagination --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-example-pagination-basic --> limel-pagination
  limel-example-pagination-language --> limel-pagination
  limel-example-pagination-loading --> limel-pagination
  limel-example-pagination-page --> limel-pagination
  limel-example-pagination-page-size --> limel-pagination
  limel-example-pagination-total-items --> limel-pagination
  style limel-pagination fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
