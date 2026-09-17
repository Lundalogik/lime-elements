
<!-- Auto Generated Below -->


## Overview

Pagination reports where the user is in a set of results, and allows them
to move somewhere else in it.

This component does not load anything on its own, and it does not move on
its own either. You give it a page and a total. When someone picks a page it
emits `goToPage` — with the `offset` and `limit` that page needs — and waits.
Set `page` to the number it gave you and the control follows.

:::note
Nothing happens until you set `page`. That is on purpose: if the load fails,
or you want to confirm something first, you just do not set it, and the
control is still showing the page the user is actually looking at.
:::

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

| Property     | Attribute     | Description                                                                                                                                                                               | Type                                                                   | Default |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------- |
| `language`   | `language`    | The language used for the labels and the tooltips, and for the way numbers are written.                                                                                                   | `"da" \| "de" \| "en" \| "fi" \| "fr" \| "nb" \| "nl" \| "no" \| "sv"` | `'en'`  |
| `loading`    | `loading`     | Set this to `true` while you are fetching a page.                                                                                                                                         | `boolean`                                                              | `false` |
| `page`       | `page`        | Which page to show. The first page is `1`, not `0`. Set it to the page from `goToPage` to move the control.                                                                               | `number`                                                               | `1`     |
| `pageSize`   | `page-size`   | Number of items that fit on one page. Together with `totalItems`, used by the component to calculate the total number of pages.                                                           | `number`                                                               | `100`   |
| `totalItems` | `total-items` | How many items there are in total, across every page. `null` means the count has not arrived yet. Together with `pageSize`, used by the component to calculate the total number of pages. | `number`                                                               | `null`  |


## Events

| Event      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Type                         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `goToPage` | Asks for a page to be loaded, and says which items it holds.  The component does not move itself. Clicking a page emits this and nothing else; set `page` to the number it carries and the control follows. Not setting it is how you decline — useful when the load fails, or when there is unsaved work to confirm first.  The one exception is a page that does not exist, which it cannot show whatever you say. There it shows the nearest page that does and emits so you can catch up. | `CustomEvent<GoToPageEvent>` |


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
