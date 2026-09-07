# Theming

Lime Elements is relatively restrictive about the look and feel of the components. For instance, consumers cannot apply custom spaces around internal elements, change border radiuses, or size of the visual details.

However, you still have lots of theming possibilities, such as setting your desired font, controlling colors on component level, and setting a global accent color.

## Setting desired font family

To achieve a blazing fast rendering, our components' user interface utilizes a default cross-browser sans-serif font stack.

Lime Element is by default font agnostic, and basically relies on the inbuilt font of user's device. So there is no need for the users to download any fonts, while loading Lime Elements on their device.

This also means that the UI would look slightly different on iOS, Android, Windows, Linux, etc… as they all have their own default system UI font.

However, you can easily set your own desired font family. As web components typically inherit font-related styles such as `font-family`, `font-size`, and `color`, we recommend defining these styles at a higher level, such as the `<body>` element.

If you use other libraries in combination with Lime Elements in your project, to maintain consistency with the look & feel demonstrated in this documentation, we suggest incorporating the following styles into your project:

```css
font-family: ui-sans-serif, system-ui, sans-serif;
font-size: 0.875rem;
font-style: normal;
font-weight: 400;
color: rgb(var(--contrast-1500));
```

💡 About the `color` specified above, read more on [our color system](#/DesignGuidelines/color-system.md/).

Or if you want to customize the font-family and related styles to suit your project's needs, you might prefer a different typeface like below:

```css
font-family: 'Roboto', Arial, Verdana, sans-serif;
```

---

## Setting an accent color

An accent color is a distinctive color used throughout a user interface to highlight interactive elements, draw attention to important actions, and reinforce brand identity. In UI libraries, the accent color typically appears on:

- Primary buttons and call-to-action elements
- Active states of form controls (checkboxes, radio buttons, switches)
- Progress indicators and loading states
- Selected items in lists or menus
- Focus indicators for keyboard navigation
- Links and other clickable elements

By setting a consistent accent color, you ensure visual cohesion across all components while maintaining your brand's color palette.

To define an accent color, set the `--lime-primary-color` CSS custom property on the `<body>` element or at the `:root` level:

:::note
You may need to define `--lime-on-primary-color` alongside your primary color to ensure proper contrast and readability. In some component, this property controls the color of text, icons, and other elements that appear on top of your accent color.
:::

```css
:root {
    --lime-primary-color: rgb(var(--color-blue-dark)); /* Your brand color */
    --lime-on-primary-color: rgb(
        var(--color-gray-lighter)
    ); /* Text/icons on primary color */
}
```

### Color Selection Guidelines

When choosing your accent color, consider these important factors:

- **Light colors** (pastels, bright tones): Generally provide poor contrast and can harm readability, especially on light backgrounds. If you must use light colors, ensure you set a dark contrasting color for text and icons: `--lime-on-primary-color: rgb(var(--color-gray-darker))` or `--lime-on-primary-color: rgb(0, 0, 0)`

- **Dark colors** (deep blues, charcoal, navy): Work well with light text and icons. Set: `--lime-on-primary-color: rgb(255, 255, 255)` or use our color token: `--lime-on-primary-color: rgb(var(--color-white))`

- **Red and green tones**: Exercise caution when using these colors as accents. Users typically associate red with errors or warnings, and green for success or confirmation. Choose these colors thoughtfully to avoid confusing your users about the intended action or state.

- **Accessibility**: Ensure your accent color meets WCAG contrast requirements (minimum 4.5:1 ratio) when paired with `--lime-on-primary-color`.

### Example

The examples below demonstrate the same button with different accent colors:

_A button with our default primary color_

<limel-example-button-primary />

_A few buttons with customized colors_

<limel-example-button-colors />

---

### Changing the global font size

Lime Elements uses `rem` units for sizing properties, including font sizes, spacing, and component dimensions; based on the standard browser root rem`16px`. This approach provides several benefits:

- **Scalability**: All components scale proportionally when the root font size changes
- **Consistency**: Maintains proper relationships between text and UI elements at any scale
- **Accessibility**: Respects user preferences for larger text sizes
- **Responsive design**: Enables easy scaling across different screen sizes and contexts

To adjust the size of all Lime Elements components and text, modify the root font size:

```css
html {
    font-size: 18px; /* Makes 1rem = 18px instead of 16px */
}
```

This change will proportionally scale all components while maintaining their visual relationships.
