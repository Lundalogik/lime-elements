# Shadows and depth

## Physical world metaphors in UI design

When learning any new interface, physical or digital, the process is made easier if elements of the interface are already familiar to us. For example, we all learn how a physical button works long before we're old enough to remember it. When learning a new interface, we might have to learn what happens when a certain button is pressed, but we shouldn't have to learn what a button _is_ and that _something_ happens when you press it. Our familiarity with elements of the physical world has long been used in the design of digital interfaces. Digital buttons are a fairly obvious example of this.

The question is, how do we recognize that something is a button? While it may be difficult to list exactly what properties make us recognize a physical button as a button, most physical buttons share some set of properties that make us recognize it as a button when we see it.

One way to help sighted users of a digital interface understand that an element is a button and they can press it and interact with it, is to make it look like a physical button. Emulating the visual qualities of physical objects in interface design is sometimes called _Skeuomorphism_.

A good example of an extreme skeuomorphic design is the first calendar app, released on the first iPhone. Its UI design featured visual details such as leather cover and paper details, to mimic a physical pocket calendar.

Despite skeuomorphism having already been replaced with more minimalistic UI design trends, we still use details from the physical world in our UI designs, to help users make sense of the elements of digital user interfaces. From a shutter-click sound of a camera app on the phone, to elements such as toggle buttons, to notions such as light, shadows, and motion.

We may look at a subtle visual clue such as an elevated button with a slight shadow underneath it, and semi-consciously perceive it as an interactable element of the user interface. This is because the elevation reminds us of a real physical button. Just by looking at it, we realize that this thing can be pressed, moved, or otherwise interacted with. We may see a toolbar or a modal placed on top of the rest of the elements on the screen, casting a slight shadow on whatever is below it. This helps us understand that the element is higher in the hierarchy, is more important, or demands more attention right now.

## Shadows

When correctly used, shadows can improve usability of UI elements. We can use shadows to:

-   create a sense of depth,
-   improve users' perception of clickable elements,
-   emphasize the hierarchy of sections of the user interface,
-   signal that a component is temporary, by placing it "on top of" a context,
-   clarify the direction of movement of an element, whether it is animated as a result of a user interaction, such as pressing a button, or to indicate transition from one state to another,
-   and even visualize distinct surfaces by clarifying their edges.

A surface’s shadow is determined by its elevation and relationship to other surfaces.
Because shadows express the degree of elevation between surfaces, they must be used consistently throughout the product.

## CSS variables that we offer for shadows

Because shadows express the degree of elevation between surfaces, they must be used consistently throughout a design. Therefore, Lime Elements offers a handful of CSS variables that can be used as `box-shadow` properties on desired elements.

:::tip
Using these variables also ensures that in dark mode, shadows are automatically adjusted to better fit darker backgrounds.
:::

### 1. Shadow variables for buttons

Buttons and similar clickable elements such as dropdown triggers or slider handles particularly benefit from the visual effect caused by shadows. Since a shadow makes the element look elevated, it naturally signals that the element can be "pressed down" again, or, in other words, clicked.

If you have custom elements (e.g. a link) that must be visualized like a button, feel free to use these variables on them.

<limel-example-button-shadows></limel-example-button-shadows>

:::tip **Tip** Change interactive shadows smoothly
It's crucial that an interaction (like hovering or pressing) that changes a visual property of an element such as its depth, is done smoothly. In other words, a change of shadows should not happen instantly. It should rather be animated with a transition. So make sure you have specified a `transition` for the `box-shadow` property, as shown below:

```scss
.my-custom-button {
    transition: box-shadow 0.2s ease, transform 0.1s ease-out;
    box-shadow: var(--button-shadow-normal);
    &:hover {
        box-shadow: var(--button-shadow-hovered);
    }
    &:active {
        box-shadow: var(--button-shadow-pressed);
        transform: translate3d(0, 0.08rem, 0);
    }
}
```

Also note how we use `transform` to make our buttons feel like they are being pushed down, when pressed by the user.
:::

### 2. Shadow variables for surfaces

In a digital user interface, there are many floating UI elements like cards, modals, menus, or popovers that can benefit from a shadow effect. Here is a list of the various CSS variables for shadows that Lime Elements offers:

<limel-example-surface-shadows></limel-example-surface-shadows>

### 3. Shadow variables for highlighting different states

<limel-example-surface-shadows-states></limel-example-surface-shadows-states>

:::tip
To give a color around the focused element, the `-focused` variables will use `--lime-primary-color` if it is defined. When it is not defined, they will default to `--color-teal-default`.
:::

---

## When not to use shadows in UI design

Sometimes we may only be trying to use shadows to create a visually distinct section, to separate a part of the interface from other parts.

In theory, having visually distinct areas in the UI increases the ease and speed of finding components or information when users are quickly scanning pages. But instead of using shadows, this visual distinction is better to be done through other ways, such as simply using outlines, dividers, larger headings, or different background colors.

:::warning
We want to reserve the visual power of shadows to indicate possibility of interaction, to signify a difference in hierarchy, or to indicate that an element in the UI is temporary.

Therefore, we strongly discourage the use of shadows when the only purpose is to create a visually distinct section in the UI.

If this is your only intention, we recommend using a different background color, different font characteristics, or relying on a good layout design that uses headings, paddings and margins well.
:::
<limel-example-shadows-bad-usage></limel-example-shadows-bad-usage>

Sometimes, using the recommended techniques above does not suffice, when you want to visually emphasize a section of the UI and make it pop out. For such cases, we offer other variables which can be used as `box-shadow` on the element.

<limel-example-surface-shadows-inflated></limel-example-surface-shadows-inflated>

:::tip
The best visual expression with these variables is achieved when:

-   the element has a sizable `border-radius`
-   there is enough empty space around the element
-   the element has a light grey as `background-color`, (preferably `var(--contrast-200)`, `var(--contrast-300)` or `var(--contrast-400)`)
-   `background-color` of the surface behind the element is not too dark or too light (preferably `var(--contrast-400)`, `var(--contrast-500)` or `var(--contrast-600)`)
-   the element's `background-color` is lighter than the surface behind it
    :::

:::warning

-   Do not overuse this visual effect on the same screen.
-   The element using this effect should not be too small, or the effect might make it look like a button.
    :::
