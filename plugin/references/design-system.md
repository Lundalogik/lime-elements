# lime-elements Design System Reference

## Color System

### Color Palettes

The color system provides CSS custom properties that automatically adapt to light and dark themes.

**20 base hues**, each with 5 variations:
`--color-{hue}-lighter` / `--color-{hue}-light` / `--color-{hue}-default` / `--color-{hue}-dark` / `--color-{hue}-darker`

Available hues: red, pink, magenta, purple, deep-purple, indigo, blue, sky, cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, coral, brown, grey.

**Contrast swatches** (for neutral UI: backgrounds, containers, text):
`--contrast-100` through `--contrast-1700` (increments of 100).
These invert between light and dark modes. Never use them for colorful elements — use the color palette instead.

**Special constants:**
- `--color-white` and `--color-black` do NOT change between modes.

### Palette Tiers

1. **UI palette** (10 swatches): Default choice for UI elements — provides semantic colors for status, errors, success, etc. Each hue has `-default` and `-light`. Use `-light` for hover states.
2. **Primary palette** (40 swatches): For icons, diagrams, and cases needing more variety.
3. **Extended palette** (100 swatches): For rich visualizations, charts, and illustrations.

### Using Color Variables

Colors are stored as **RGB triples without parentheses**:
```css
--color-blue-default: 33, 150, 243;
```

Usage:
```scss
// Solid color
color: rgb(var(--color-blue-default));

// With alpha
color: rgba(var(--color-blue-default), 0.1);
```

### Primary Accent Color

Set one accent color for your product via:
```css
--lime-primary-color: 0, 150, 136; /* your brand color as RGB triple */
```

This affects: primary buttons, checkboxes, radio buttons, input focus styles, selected/active states, and more.

### Elevated Surfaces

Use `--lime-elevated-surface-background-color` for cards, modals, and popovers. It automatically picks the right contrast for light/dark mode:
```scss
.my-card {
    background-color: var(--lime-elevated-surface-background-color);
}
```

### Dark Mode

Load `@limetech/lime-elements/dist/lime-elements/style/color-palette-extended.css` to enable dark mode support. Users' OS/browser preference is respected by default. Force a mode with:
```html
<html data-theme="force-dark">
```

### Color Philosophy

- UI should be **neutrally colored** using contrast scales. Reserve color for meaning and attention.
- One accent color only. Colors communicate meaning — don't use them for decoration.
- Big surfaces (headers, backgrounds) should NOT be intensively colored.
- Brand colors exist (`--lime-brand-color-*`) but should be used sparingly (splash screens, logos).

---

## Size Rhythms

### The 4x Rule

All spacing values (padding, margin, gap, width, height) must be **multiples of 4**: 4, 8, 12, 16, 20, 24, ...

### Units: rem Only

Use `rem` exclusively (1rem = 16px by default):
- 4px = 0.25rem
- 8px = 0.5rem
- 12px = 0.75rem
- 16px = 1rem
- 24px = 1.5rem
- 32px = 2rem

SCSS helper:
```scss
@function pxToRem($px) {
    @return #{$px/16}rem;
}
```

### The 1px Exception

Always write `1px` for borders, never `0.0625rem`. Sub-pixel rems may not render correctly on all displays.

### Other Exceptions to 4x

- **font-size**: Typography has its own scaling needs; 13px or 14px are acceptable.
- **border-radius**: Pick the value that looks right.
- **box-shadow, blur**: Flexible for visual expression.
- Occasional small deviations (e.g., 6px padding) are fine if the overall structure stays in 4x rhythm.

---

## Shadows and Depth

### Purpose of Shadows

Use shadows to:
- Signal interactivity (buttons look "pressable")
- Indicate hierarchy (modals float above content)
- Signal temporary elements (popovers, menus)
- Clarify movement direction during animations

### Button Shadow Variables

```scss
.my-button {
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

### Surface Shadow Variables

For floating UI elements (cards, modals, menus, popovers): use the surface shadow variables provided by lime-elements. These auto-adjust for dark mode.

### State Shadow Variables

Focus state shadows use `--lime-primary-color` (falling back to `--color-teal-default`).

### When NOT to Use Shadows

Do NOT use shadows just to create visually distinct sections. Instead use:
- Different background colors
- Outlines or dividers
- Larger headings
- Good layout with padding and margins

Reserve shadows for: interactivity, hierarchy, and temporary elements.

For inflated/emphasized sections (not buttons), use the inflated surface shadow variables with:
- Sizable `border-radius`
- Enough empty space around the element
- Light grey background (`--contrast-200` to `--contrast-400`)
- Parent surface slightly darker (`--contrast-400` to `--contrast-600`)

---

## Decluttering and Cognitive Load

### Philosophy

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupery

Fewer elements on screen = less cognitive load = users spend mental energy on their task, not the UI.

### Principles

1. **Progressive disclosure**: Show details only when relevant. Input field helper text and character counters appear only on focus.
2. **Tooltips over labels**: Use tooltips for supplemental info users need only occasionally.
3. **Hide irrelevant buttons**: Disabled buttons that serve no informational purpose should be hidden until they become relevant.
   - **Show disabled** when: user needs to know an action exists but can't use it yet (e.g., "Save" when form has errors).
   - **Hide entirely** when: the action isn't relevant to the user's current intent (e.g., "Save" on a read-only display page).
4. **Question every element**: Is this needed? What's the trade-off of removing it? Does it add to clutter without adding functionality?
