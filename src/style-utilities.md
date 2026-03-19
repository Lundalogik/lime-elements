# Style Utilities

Lime Elements provides a set of reusable SCSS mixins and variables
that help consumer projects maintain consistent styling
with the design system.

## How to import

First, make sure your Sass configuration includes `node_modules`
in the load paths. For example, in a Stencil project:

```ts
plugins: [
    sass({
        includePaths: ['node_modules'],
    }),
],
```

:::note
This does not make the Sass compiler scan or auto-include files
from `node_modules`. It simply allows `@use` to resolve
package paths (like `@limetech/lime-elements/...`)
the same way Node resolves module imports.
No files are loaded unless explicitly referenced
with `@use` or `@forward`.
:::

Then import the style utilities in any `.scss` file:

```scss
@use '@limetech/lime-elements' as lime-elements;
```

:::note
Avoid using `lime` as the namespace alias.
While Dart Sass does accept it, `lime` is also a CSS color keyword,
which can lead to confusing code.
:::

---

## Why use these?

While our components can be used on their own without any extra styling,
you may still want your own custom elements to look and feel
consistent with the rest of the design system.

Since web components use Shadow DOM, they cannot inherit styles
from parent elements or be affected by global CSS helper classes.
This means that common patterns like hover effects, text truncation,
or responsive breakpoints need to be applied inside each component.

These mixins give you a shortcut. Instead of re-implementing
these styles from scratch, you can include them directly
and stay aligned with the visual language of Lime Elements.

Because we use the same mixins internally across our own components,
your custom elements will automatically benefit from any
future style refinements we make, without requiring manual updates
on your side.

Here are a few examples of what is available:

### Clickable elements

If you are building a custom interactive element (such as a card, a tile,
or a custom button) and want it to visually behave
like other clickable elements in the design system,
you can use one of the clickable mixins.

These mixins add hover, focus, and active state transitions
(including shadows, color changes, and subtle transforms)
to make the element feel responsive and consistent.

#### `is-elevated-clickable`

Use this for elements that should start slightly elevated (with a minor shadow)
and gain elevation on hover (a larger and more distinct shadow).

```scss
@use '@limetech/lime-elements' as lime-elements;

.my-custom-button {
    @include lime-elements.is-elevated-clickable();
    @include lime-elements.visualize-keyboard-focus;

    padding: 1rem;
    border-radius: 0.5rem;
}
```

The mixin accepts optional parameters for customizing
colors in different states:

```scss
.my-special-card {
    @include lime-elements.is-elevated-clickable(
        $color: rgb(var(--color-blue-default)),
        $color--hovered: rgb(var(--color-blue-dark))
    );
}
```

Other clickable variants include
`is-flat-clickable`, `is-elevated-inset-clickable`,
and `is-flat-inset-clickable`.

---

### Responsive design

A set of breakpoint variables and media query mixins
are provided for building responsive layouts.

#### Media query mixins

These mixins wrap predefined breakpoints,
so you do not have to remember or hard-code pixel values:

```scss
@use '@limetech/lime-elements' as lime-elements;

:host {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    @include lime-elements.when-viewport-width-is-narrow {
        grid-template-columns: 1fr;
    }

    @include lime-elements.when-viewport-width-is-medium {
        grid-template-columns: 1fr 1fr;
    }
}
```

Available media query mixins:

- `when-viewport-width-is-narrow` - up to 800px
- `when-viewport-width-is-not-narrow` - above 800px
- `when-viewport-width-is-medium` - between 801px and 1023px
- `when-viewport-width-is-not-large` - up to 1023px
- `when-viewport-width-is-large` - above 1023px

:::important
In most cases, you should prefer CSS-native responsive techniques
(CSS Grid, Flexbox, container queries) over media queries.
Use these mixins only when you genuinely need
viewport-based breakpoints.
:::

---

### Text utilities

#### `truncate-text`

Truncates overflowing text with an ellipsis on a single line:

```scss
.label {
    @include lime-elements.truncate-text;
}
```

#### `truncate-text-on-line`

Truncates text after a given number of lines:

```scss
.description {
    @include lime-elements.truncate-text-on-line(3);
}
```

---

## All available utilities

For the complete list of available mixins, variables,
and their parameters, refer to the source files forwarded
by `exports.scss` in the installed package.
