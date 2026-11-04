
<!-- Auto Generated Below -->


## Overview

A popover is an impermanent layer that is displayed on top of other content
when user taps an element that triggers the popover. This element can be
practically anything, a button, piece of text, and icon, etc.

Popovers are nonmodal, thus they don't have a semi-transparent backdrop layer
that darkens the content below them. Also for the same reason, they can be
dismissed by tapping or clicking another part of the screen, but not by a
clicking a button or link on the popover itself.

## Usage
Use a popover to show **options** or **information** related to the trigger
onscreen. A typical use case for popovers is a tooltip, in which you show
help text or contextual information to users.

Popovers are most appropriate on larger screens but can be used on smaller
screens too, as long as their content is responsive and takes into account
the context they are displayed on.

When a popover is displayed, interactions with other controls are blocked,
until user dismisses the popover.


## Layout
Popovers has only one slot in which you can import a custom web-component.

:::note
You must make sure that web-components that you import into the slot has
a `width: 100%;` style so that it can horizontally stretch across the popover.

However, `width` of the popover can be controlled by specifying a CSS variable
of `--popover-surface-width`. If you don't specify any width, the popover
will grow as wide as its content.
:::

:::important
Do not make a popover too big. They should never take over the entire screen.
If your content is that big, you should probably be using a Modal instead.
:::

## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Type                                                                                                                                                                 | Default     |
| ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `accessibleLabel` | `accessible-label` | The name of the popup, which a screen reader announces when the focus moves into it. Used together with `popupRole`.                                                                                                                                                                                                                                                                                                                                                                                                  | `string`                                                                                                                                                             | `undefined` |
| `open`            | `open`             | True if the content within the popover should be visible                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                                                                                                            | `false`     |
| `openDirection`   | `open-direction`   | Decides the popover's location in relation to its trigger                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `undefined` |
| `popupRole`       | `popup-role`       | Says what kind of popup the trigger opens, so that a screen reader can announce it. Use the one that fits what you put in the popover: `dialog` for a form, a message or other content, and `menu`, `listbox`, `tree` or `grid` when the content is one of those widgets.  A popup with one of these roles needs a name, so the role is used only together with `accessibleLabel`. Without one, the popover warns in the console.  When the role is not set or not used, the trigger only says that it opens a popup. | `"dialog" \| "grid" \| "listbox" \| "menu" \| "tree"`                                                                                                                | `undefined` |


## Events

| Event   | Description                                  | Type                |
| ------- | -------------------------------------------- | ------------------- |
| `close` | Emits an event when the component is closing | `CustomEvent<void>` |


## Slots

| Slot | Description                       |
| ---- | --------------------------------- |
|      | Content to put inside the surface |


## Dependencies

### Used by

 - [limel-color-picker](../color-picker)
 - [limel-dock-button](../dock/dock-button)
 - [limel-example-popover-basic](examples)
 - [limel-example-popover-styling](examples)
 - [limel-example-popover-trigger-interaction](examples)
 - [limel-example-portal-basic](../portal/examples)
 - [limel-example-side-panel-escape](../side-panel/examples)
 - [limel-example-text-editor-triggers](../text-editor/examples)
 - [limel-help](../help)
 - [limel-pagination](../pagination)
 - [limel-profile-picture](../profile-picture)

### Depends on

- [limel-portal](../portal)
- [limel-popover-surface](../popover-surface)

### Graph
```mermaid
graph TD;
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-color-picker --> limel-popover
  limel-dock-button --> limel-popover
  limel-example-popover-basic --> limel-popover
  limel-example-popover-styling --> limel-popover
  limel-example-popover-trigger-interaction --> limel-popover
  limel-example-portal-basic --> limel-popover
  limel-example-side-panel-escape --> limel-popover
  limel-example-text-editor-triggers --> limel-popover
  limel-help --> limel-popover
  limel-pagination --> limel-popover
  limel-profile-picture --> limel-popover
  style limel-popover fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
