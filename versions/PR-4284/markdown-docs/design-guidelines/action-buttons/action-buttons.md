# Action buttons

Action buttons are typically used in dialog footers, or in headers. These buttons indicate to users that they must deliberately choose one action from the set of actions presented, for the system to continue or finish a task.

Action buttons must be presented together in one place, in a way that feels natural within the UI. When several action buttons are presented, their actions are often contradictory; for example **Discard** versus **Save**.

When it comes to details such as placement of action buttons, choice of labels, and adding meaningful graphical details, it's important to follow a few design conventions, explained in this guide.

<br/>
<br/>

---

## Placement

On a user interface which is designed for a left-to-right script like English, action buttons of a footer (for example in a dialog) are typically located at the bottom-right corner.

When there are two buttons placed together, the button that represents a positive action is always on the right side, and the one which presents a negative one is on the left.

A positive action could be an action that:

- takes the user forwards or to next step; e.g. _Next_, _Skip_, or _Continue_
- is primary, and most probably the one that users is going to select, e.g. _Save_, _Update_, _Send_ (or even _Delete_ which is a negative notion, but can be an expected or "primary" action, depending on the context, like in a confirm deletion dialog)

A negative action could be an action that:

- takes the user back, dismisses a dialog, or cancels an ongoing process; e.g. _Back_, _Cancel_, _Discard_
- is secondary, which means it is not likely that users clicks it in that context

<limel-example-action-buttons-placement></limel-example-action-buttons-placement>

:::tip
In [`limel-dialog`](#/components/limel-dialog), there is a `slot` called `button`, which is a "flexbox". It automatically aligns its child elements to the right side. All you need to do is add `slot="button"` to the elements you wish to appear in the slot.

```tsx
<limel-button label="OK" slot="button" />
```

:::

<br/>

---

## Primary versus secondary actions

As you know, `limel-button` can have a `primary={true}` property, which makes it stand out by getting the primary color of your theme.

One of the action buttons is normally the primary action. That is the action that you expect the users to take, or you that want them to take.

<limel-example-action-buttons-primary-secondary></limel-example-action-buttons-primary-secondary>

A primary button has a stronger visual weight, and appearing more distinct makes it easier for users to chose the correct, safe, or promoted action.

You can use this visual distinction to promote the action that is safer, even if that action may not be the primary action. You can do so because sometimes:

- it can be hard to identify the intention of the user
- the action may be irreversible or risky

<limel-example-action-buttons-primary-secondary-reversed></limel-example-action-buttons-primary-secondary-reversed>

<br/>

---

## Choosing good labels

Labels you use should make sense together. You are usually dealing with contradictory actions. Therefore, what you put on each button should also reflect the contradiction.

<limel-example-action-buttons-choosing-labels></limel-example-action-buttons-choosing-labels>

Labels must make each option as clear as possible. An explicit label give users more confidence in selecting the correct action.

:::note

- Use a label that explains what the button does, rather than a generic label (such as “OK”, or "Yes").
- Using verbs as labels instead of nouns is better, because a verb describes the action better.
  :::

<limel-example-action-buttons-choosing-explicit-labels></limel-example-action-buttons-choosing-explicit-labels>

<br/>

---

## Providing a third alternative action

Sometimes having two actions is not enough for the user to make a decision with peace of mind. A common scenario is when a user has unsaved changes and tries to navigate away from the view. In such cases, typically a prompt maybe be shown to alert the user and give them a few logical choices.

This prompt can offer two main actions of "Save" and "Discard" (which means "save & continue navigating away from this page" and "discard & continue navigating away from this page"), along with a third choice that allows users to cancel (and go back / not continue navigating away!).

<limel-example-action-buttons-third-alternative></limel-example-action-buttons-third-alternative>

The action that takes users one step back in the process is intentionally placed on the left side. This makes it easier for users to mentally separate the other two. Additionally, the placement makes it easier to connect the action to the notion of going back. (For left-to-right scripts. Left and right will of course have reversed meaning in right-to-left script, which is precisely why the CSS properties for these things use values like `flex-start` and `flex-end`, rather than `left` and `right`. See below.)

If buttons are placed in a full width flex container that has `justify-content: flex-end;`, these styles will align the targeted button to left side of the flex box. See "Example with three action buttons" in the [documentation for `limel-dialog`](#/component/limel-dialog/).

```scss
.back-button {
    justify-self: flex-start;
    margin-right: auto;
}
```

---

## Adding more meaning with colors and icons

To make it easer for users to understand the message and make a decision faster, you can use icons and colors on the buttons.

Learn more about [usage of colors and color conventions in the UI](#/DesignGuidelines/color-system.md/), and [how to color limel-buttons](#/component/limel-button/).

<limel-example-action-buttons-icon-color></limel-example-action-buttons-icon-color>

:::note
It might be tempting to use colors on action buttons to make the user interface more cheerful. But using colors in a user interface must follow certain UI design conventions, as colors convey meaning. Learn more about [usage of colors and color conventions in the UI](#/DesignGuidelines/color-system.md/).
:::

<limel-example-action-buttons-primary-secondary-reversed-colors></limel-example-action-buttons-primary-secondary-reversed-colors>

:::note
If an action is not irreversible or too risky, the design does not have to put a lot of visual emphasis on the secondary action, by means of icons and colors. In such cases, highlighting the primary action and making it more recognizable is more relevant, and more motivated.
:::

<limel-example-action-buttons-colors-do-dont></limel-example-action-buttons-colors-do-dont>
