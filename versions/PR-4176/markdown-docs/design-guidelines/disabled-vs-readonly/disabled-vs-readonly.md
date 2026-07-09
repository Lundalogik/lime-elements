# Disabled vs. Readonly

You may have noticed the our input type components such as Checkbox, Input field, Select, and Slider, offer a boolean property called `readonly`.

Readonly may sound like Disabled at first. But why do we offer these two different states for such component?

In the context of a component library like Lime Elements, `readonly` may not be regarded as a standard attribute on input elements such as checkboxes,
toggle switches or input fields.

This special state is something that we introduced in our components, because of the internal complexities of Lime CRM and the way some data is presented to different end-users in different ways, for example based on their access rights, user roles, and permissions. In the CRM app, a group of end users may not have permission to check a box or toggle a switch, but they should still be able to see what value it holds.

However, the `readonly` state may be unique to us, and many other products which are built using Lime Elements can benefit from it too. So, let's explore the difference between `disabled` and `readonly` states.

-   A form field is normally there to receive inputs from users. However, when a form field is set to `readonly`, it does not function as the original field was intended anymore.

    The `readonly` state is set solely for the purpose of "data visualization" for the end-users. This is why we do not render the input elements in `readonly` mode, as if they could be interacted with.

-   On the other hand, the `disabled` is a standard state for input elements. When an input component such as a checkbox or input field is `disabled` we maintain its original look and feel, but add some visual cues to indicate that the component is _currently_ or _temporarily_ disabled for some reason, and cannot be interacted with right now.

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
