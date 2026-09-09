# lime-elements Quick Start — Standalone HTML

How to load and use lime-elements **outside** of a Stencil project (plain HTML, prototyping, non-Stencil apps).

---

## Required Files

Every standalone page needs these **three** resources plus `limel-config`:

| # | File | Purpose |
|---|------|---------|
| 1 | `color-palette-extended.css` | Full color palette (light + dark mode) |
| 2 | `lime-elements.css` | Component styles |
| 3 | `lime-elements.esm.js` | Component runtime (ES module) |
| 4 | `<limel-config>` element | Icon path + app-level config |

Missing any of these will cause broken rendering, missing colors, or invisible icons.

---

## Loading Patterns

### Local development (from dev server)

When running the lime-elements dev server (`npm start`):

```html
<link href="/style/color-palette-extended.css" rel="stylesheet">
<link href="/build/lime-elements.css" rel="stylesheet">
<script type="module" src="/build/lime-elements.esm.js" data-stencil></script>
```

### From unpkg CDN

For quick prototyping without a local build:

```html
<link href="https://unpkg.com/@limetech/lime-elements@latest/dist/lime-elements/style/color-palette-extended.css" rel="stylesheet">
<link href="https://unpkg.com/@limetech/lime-elements@latest/dist/lime-elements/lime-elements.css" rel="stylesheet">
<script type="module" src="https://unpkg.com/@limetech/lime-elements@latest/dist/lime-elements/lime-elements.esm.js"></script>
```

Pin a version by replacing `@latest` with e.g. `@39.9.0`.

### From npm dist (self-hosted)

After `npm install @limetech/lime-elements`, the files are at:

```
node_modules/@limetech/lime-elements/dist/lime-elements/lime-elements.esm.js
node_modules/@limetech/lime-elements/dist/lime-elements/lime-elements.css
node_modules/@limetech/lime-elements/dist/lime-elements/style/color-palette-extended.css
```

---

## Required Setup

### limel-config

Place a `<limel-config>` element in the body and set its `config` property via JavaScript. This is **required** for icons to work:

```html
<limel-config></limel-config>
<script>
    document.querySelector('limel-config').config = {
        iconPath: 'https://lundalogik.github.io/lime-icons8/',
    };
</script>
```

### z-index variables

Dialogs, popovers, and dropdowns need z-index variables. Add these in a `<style>` block:

```html
<style>
    :root {
        --dialog-z-index: 110;
        --popover-z-index: 115;
        --dropdown-z-index: 120;
    }
</style>
```

### Dark mode

Add the `data-theme="dark"` attribute to the `<html>` element:

```html
<html data-theme="dark">
```

---

## Complete Minimal Example

A full working HTML file with a single component:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>lime-elements Demo</title>

    <!-- 1. Color palette -->
    <link href="https://unpkg.com/@limetech/lime-elements@latest/dist/lime-elements/style/color-palette-extended.css" rel="stylesheet">
    <!-- 2. Component styles -->
    <link href="https://unpkg.com/@limetech/lime-elements@latest/dist/lime-elements/lime-elements.css" rel="stylesheet">
    <!-- 3. Component runtime -->
    <script type="module" src="https://unpkg.com/@limetech/lime-elements@latest/dist/lime-elements/lime-elements.esm.js"></script>

    <style>
        :root {
            --dialog-z-index: 110;
            --popover-z-index: 115;
            --dropdown-z-index: 120;
        }
        body {
            font-family: ui-sans-serif, system-ui, sans-serif;
            padding: 2rem;
            background: rgb(var(--contrast-100));
            color: rgb(var(--contrast-1400));
        }
    </style>
</head>
<body>
    <!-- 4. Required config -->
    <limel-config></limel-config>
    <script>
        document.querySelector('limel-config').config = {
            iconPath: 'https://lundalogik.github.io/lime-icons8/',
        };
    </script>

    <!-- Your components -->
    <limel-button label="Click me" primary></limel-button>

    <script>
        document.querySelector('limel-button')
            .addEventListener('click', (e) => {
                alert('Button clicked!');
            });
    </script>
</body>
</html>
```

---

## Important: file:// Won't Work

ES modules require an HTTP server. Opening the HTML file directly (`file://...`) will fail with CORS errors. Use any local server:

```bash
npx serve .
# or
python3 -m http.server
```

---

## Event Handling in Vanilla JS

lime-elements components emit `CustomEvent`. The value is always in `event.detail`:

```js
const input = document.querySelector('limel-input-field');
input.addEventListener('change', (event) => {
    console.log('New value:', event.detail);
});
```

To set object/array properties, use JavaScript (not HTML attributes):

```js
const picker = document.querySelector('limel-picker');
picker.searcher = async (query) => {
    // return filtered items
    return items.filter(i => i.text.includes(query));
};
```
