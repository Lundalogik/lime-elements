# Reducing UI clutter and cognitive load

A user interface with too many elements requires more processing from users' brains. When fewer things on the screen try to attract the user's attention, it becomes easier for the user to "consume" the UI. This is what we mean when we talk about "reducing cognitive load". In the end, our goal is for the user to spend their mental energy on the problem at hand, not at the tool they are using to solve it (our UI).

## Buttons

Buttons are particularly strong elements in the UI, since they are meant to perform important actions. Thus, an effective way of reducing clutter is to hide buttons that aren't useful at the moment. This most commonly applies to disabled buttons.

Disabled buttons can convey important information, but when they don't, they should be hidden. Here are some examples:

1. **When there are invalid fields, or empty required fields**
   We can anticipate that the user might try to save their changes, and showing a disabled Save button is part of telling the user that there is something they need to do before saving is possible. This should be combined with other clear visual hints on what to do, like highlighting the invalid field and displaying a validation error message.
2. **When the user has made no changes**
   This example can be divided into two groups:
   - *The user is in a distinct "flow" with discrete steps, and is prevented from continuing to the next step.* Common examples are so called "wizards". In this case, a disabled Save or Continue button should be kept visible, for the same reason as in example 1.
   - *Making and saving changes is just one of the possible "things to do" on the current page.* Examples include forms that are used both for displaying and changing information (common for configuration or settings pages), or a feed, with an input for adding new posts. In this case, a disabled Save button isn't useful. We don't even know that the user has any intention of using it. Once the user updates the information, or starts writing in the input field, it's time to display the Save button, along with any other controls that might have also been hidden.

:::note
Keep in mind that a SAVE button can be disabled but visible, to tell the
users that requirements are not met, or there are errors.

Such cases should be accompanied with other clear visual hints where the
errors or progress-blockers are located in the UI.
:::
