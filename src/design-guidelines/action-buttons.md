# Action buttons

for placement, choice of labels, & helpful graphical details

Action buttons are typically used in dialogs' footers, or in headers. These are buttons

## Dialogs with several action buttons

Sometimes dialogs come with several action buttons. They are used to ensure
that the user deliberately confirms an action, from a set of actions which are
often contradictory; for example Discard versus Save.
:::note
There are a few design conventions that you must follow, when presenting
several action buttons. Look at the example below to get a better understanding
of these conventions.
:::

##### Placement
On a user interface which is designed for a left-to-right
script like English, action buttons of a dialog are
typically located on the bottom-right corner. In that slot,
the Positive action is always on the right side, and the
negative one is on the left.

<limel-example-action-button-conventions_placement></limel-example-action-button-conventions_placement>

## Primary versus secondary actions

As you know, <code>limel-button</code> can have a `primary={true}` property,
which makes it stand out by getting the defined primary color.

One of your action buttons is normally the primary action. That is the action
that you expect the users to take, or you want or prefer them
to click on. This is usually a safe action, and that is why you want to
promote it by highlighting it.

<limel-example-action-button-conventions_primary-secondary></limel-example-action-button-conventions_primary-secondary>


## Choosing good labels

Labels you use should make sense together. You are usually
dealing with contradictory actions, thus what you put on
each button should also reflect the contradiction.

<limel-example-action-button-conventions_choosing-labels></limel-example-action-button-conventions_choosing-labels>


## Adding more meaning with colors and icons

To make it easer for the users to understand the message and take a decision
faster you can use icons and colors on the buttons.

Learn more about [usage of colors](#/DesignGuidelines/color-system.md/),
and [how to color limel-buttons](#/component/limel-button/).

<limel-example-action-button-conventions_icon-color></limel-example-action-button-conventions_icon-color>


## Providing a third alternative action

Sometimes having two action is not enough for the user to
take a decision. A common scenario is when a user has
unsaved changes and tries to navigate away from the view. In
such cases, typically a prompt maybe be shown, to alert
users about consequences of their action, and give them a few logical choices.

In such a case, you can offer two main actions of "Save (and
third choice that allows users to "Cancel (and go back / not continue!)".

<limel-example-action-button-conventions_third-alternative></limel-example-action-button-conventions_third-alternative>
