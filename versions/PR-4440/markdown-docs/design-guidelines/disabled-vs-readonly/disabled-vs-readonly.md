# Disabled vs. Readonly

You may have noticed the our input type components such as Checkbox, Input field, Select, and Slider, offer a boolean property called `readonly`.

Readonly may sound like Disabled at first. But why do we offer these two different states for such component?

In HTML, `readonly` is a standard attribute of text inputs and textareas. It does not exist for checkboxes, switches, sliders and selects, but ARIA has `aria-readonly` for them. In Lime Elements, all of these components offer `readonly`, and it means the same in all of them.

We offer it everywhere because of the internal complexities of Lime CRM and the way some data is presented to different end-users in different ways, for example based on their access rights, user roles, and permissions. In the CRM app, a group of end users may not have permission to check a box or toggle a switch, but they should still be able to see what value it holds.

Many other products which are built using Lime Elements can benefit from it too. So, let's explore the difference between `disabled` and `readonly` states.

-   A form field is normally there to receive inputs from users. However, when a form field is set to `readonly`, it does not function as the original field was intended anymore.

    The `readonly` state is set solely for the purpose of "data visualization" for the end-users. This is why a `readonly` component is drawn without any sign that it could be interacted with: it has no outline, and no hover or pressed state.

    A readonly field that holds text (an input field, a date picker, a color picker, a picker or a file field) can still be focused, so that its value can be read, selected and copied with the keyboard. So can a select, which does not open. Assistive technologies announce them as read only.

-   On the other hand, the `disabled` is a standard state for input elements. When an input component such as a checkbox or input field is `disabled` we maintain its original look and feel, but add some visual cues to indicate that the component is _currently_ or _temporarily_ disabled for some reason, and cannot be interacted with right now.

    A disabled field cannot be focused, and assistive technologies announce it as unavailable.

    While interacting with the user interface, The end-users can then make a hypothesis that if they actively change something, or if they try to meet the requirements (for instance by answering a required question in a form), the disabled field may become enabled.

In short…

:::important

-   **`disabled` implies:** the field is currently non-interactive
    but can become "enabled" under certain conditions.
    For instance, a disabled checkbox might become enabled if the user
    selects a specific option from a dropdown menu in the UI.
-   **`readonly` implies:** the field is non-editable and will remain
    so irrespective of user actions. A readonly field serves as a
    non-interactive element, solely for illustrating the data.

:::
