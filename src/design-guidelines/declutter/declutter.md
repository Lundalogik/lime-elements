# Reducing UI clutter and cognitive load

## The philosophy
**Minimalism -** From our point of view, a great product or tool is essentially one that has a minimalistic user interface. This is not limited to digital products, but it becomes extra important for digital products, as they are often packed with tools, features, and functionalities.

With regard to both aesthetics and functionality, a minimalist product should be reduced to its necessary elements. This can be achieved by using fewer design elements, less ornamental elements in its visual design, fewer options and features, and less occupied screen space; as well as carefully breaking the interaction flows or functionalities into distinct and meaningful parts.

Thus, when designing a product, we have to keep removing elements and questioning their existence in the UI. We should always keep asking questions such as: Is this really needed? Does this really have to be there? Why? What's the trade-off if it's removed? Do we lose functionality? Do we lose usability? And so forth.
> Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.
>
> – Antoine de Saint-Exupéry

## The science
**Cognitive load –** A user interface with too many elements requires more processing from users' brains. When fewer things on the screen try to attract the user's attention, it becomes easier for the user to "consume" the UI.

This is what we mean when we use the term "cognitive load" and talk about "reducing cognitive load". In the end, our goal is for the user to spend their mental energy on the problem at hand, not at the tool they are using to solve it (our UI).
*****
## Examples

### Input fields
Whenever possible, we take care of these details in our components. For instance, in the `limel-input` components, the "Helper text" and "Character counters" get displayed only when the field is `focused`, meaning when the user is typing in the input box. Before the user interacts with the component, displaying such details is not helpful and only adds to the clutter on the screen.

<!-- <limel-example-input-field-text></limel-example-input-field-text> -->
<!--
NOTE: this example below is almost a duplicate of the example above.
Because here we need the example to have a white background due to our
lack of support for dark mode. When we have proper support
for dark mode in lime elements, this example and its CSS can be deleted.
Instead of this 👇, we can use that 👆 again. / Kia
-->
<limel-example-input-field-text-decluttering-guidelines></limel-example-input-field-text-decluttering-guidelines>

However, sometimes such design decisions depend on the context and it is only you who are designing the UI that can judge. Examples of these follow below.

### Tooltips
Tooltips are also helpful components in creating a clean UI, by hiding away supplemental
but disposable pieces of information.

Users may need such information only once (usually for the first time they
use a UI) or occasionally. Therefore instead of constantly showing them
in the user interface, a tooltip can be used to hide them away and display them once needed.
<limel-example-tooltip-declutter></limel-example-tooltip-declutter>

### Buttons
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

See how Lime Elements can automatically hide buttons when they are not needed, in the "Reduce Presence" example for [limel-button](#/component/limel-button/).
