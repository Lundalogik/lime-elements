# lime-elements Component Catalog

All components use the `limel-` tag prefix. They are Web Components (shadow DOM) built with Stencil.js and work with any framework.

**Package:** `@limetech/lime-elements`
**Docs:** https://lundalogik.github.io/lime-elements/

---

## Prerequisites

Every page that uses lime-elements needs these resources loaded:

1. **CSS:** `color-palette-extended.css` (color palette) + `lime-elements.css` (component styles)
2. **JS:** `lime-elements.esm.js` with `type="module"`
3. **Config:** A `<limel-config>` element with `iconPath` set:
   ```html
   <limel-config></limel-config>
   <script>
       document.querySelector('limel-config').config = {
           iconPath: 'https://lundalogik.github.io/lime-icons8/',
       };
   </script>
   ```

For the full loading pattern with CDN URLs and a complete working example, see [`quick-start.md`](quick-start.md).

---

## Navigation & Layout

### `limel-dock`
Vertical navigation sidebar with icons, labels, badges, and collapsible state. Switches to horizontal on mobile.

**Key props:** `dockItems`, `dockFooterItems`, `expanded`, `allowResize`, `mobileBreakPoint`
**Use cases:** Primary app navigation. Supports nested popover menus and badge counts.

### `limel-tab-bar`
Horizontal scrollable tabs for switching between content sections.

**Key props:** `tabs`
**Use cases:** Top-level content organization. Supports icons and badges. Never nest tab bars.

### `limel-tab-panel`
Combines tab bar with slotted content panels — auto-shows the active panel.

**Key props:** `tabs`
**Use cases:** Convenience wrapper when each tab maps to a slotted element.

### `limel-breadcrumbs`
Horizontal navigation trail showing hierarchy or history.

**Key props:** `items`, `divider`
**Use cases:** Page hierarchy navigation. Items can be links or buttons.

### `limel-shortcut`
A navigational tile with icon and label for dashboards and start pages.

**Key props:** `icon`, `label`, `link`, `badge`, `disabled`
**Use cases:** Quick-access navigation tiles on home screens.

### `limel-grid`
CSS Grid wrapper for responsive layouts.

**Key props:** (CSS-driven)
**Use cases:** Responsive page layouts and card grids.

### `limel-flex-container`
Flexbox layout wrapper.

**Key props:** (CSS-driven)
**Use cases:** Horizontal/vertical arrangements of child elements.

---

## Buttons & Actions

### `limel-button`
Standard clickable button for triggering actions.

**Key props:** `label`, `icon`, `primary`, `outlined`, `disabled`, `loading`, `loadingFailed`
**Use cases:** Form submission, dialogs, commands. Use `primary` for the main action.

### `limel-icon-button`
Icon-only button with accessible label shown to screen readers/tooltip.

**Key props:** `icon`, `label`, `disabled`, `elevated`
**Use cases:** Toolbar actions, header controls, compact UI. `elevated` adds shadow.

### `limel-split-button`
Button with primary action + dropdown arrow revealing alternatives.

**Key props:** `label`, `icon`, `items`, `primary`, `disabled`, `loading`
**Use cases:** "Save" with "Save and close" / "Save as draft" alternatives.

### `limel-button-group`
Set of mutually selectable buttons for view switching or filtering.

**Key props:** `value`, `disabled`
**Use cases:** Toggle between views (Map/Satellite) or quick filters.

### `limel-action-bar`
Centralized hub for context-relevant actions, supports floating layout.

**Key props:** `actions`, `collapsible`, `layout`, `openDirection`
**Use cases:** Toolbars, bulk operation bars, floating action panels.

---

## Form Inputs

### `limel-input-field`
Versatile text input: text, number, email, URL, phone, password, search, textarea.

**Key props:** `value`, `type`, `label`, `disabled`, `readonly`, `required`, `invalid`, `helperText`, `leadingIcon`, `trailingIcon`, `prefix`, `suffix`, `completions`, `maxlength`, `pattern`
**Use cases:** Any free-text or numeric input in a form. Supports inline autocomplete.

### `limel-select`
Styled dropdown for choosing from a fixed list.

**Key props:** `options`, `value`, `label`, `multiple`, `disabled`, `readonly`, `required`
**Use cases:** When options are enumerable and fixed (unlike picker's dynamic search).

### `limel-picker`
Search-as-you-type field for finding and selecting items, shown as chips.

**Key props:** `value`, `label`, `searcher`, `allItems`, `multiple`, `disabled`, `readonly`, `required`
**Use cases:** Associating records (contacts, users, tags) from large datasets. Provide `searcher` for server-side lookup.

### `limel-checkbox`
Classic checkbox with checked, unchecked, and indeterminate states.

**Key props:** `checked`, `label`, `disabled`, `readonly`, `indeterminate`, `required`
**Use cases:** Multi-selection in forms and settings. Indeterminate for parent checkboxes.

### `limel-switch`
Binary toggle for immediate-effect settings.

**Key props:** `value`, `label`, `disabled`, `readonly`, `required`
**Use cases:** Settings that take effect immediately (dark mode, notifications). Use checkbox when submit is needed.

### `limel-radio-button-group`
Mutually exclusive radio buttons from a list of items.

**Key props:** `items`, `selectedItem`, `disabled`
**Use cases:** Exactly one option from a short list. Always provide 2+ options.

### `limel-slider`
Range input for numeric value selection.

**Key props:** `value`, `label`, `valuemin`, `valuemax`, `step`, `unit`, `disabled`, `readonly`
**Use cases:** Numeric ranges in settings or filters (percentages, temperatures).

### `limel-date-picker`
Date/time input with calendar popover (Flatpickr).

**Key props:** `value`, `type`, `label`, `disabled`, `readonly`, `required`, `language`, `format`
**Use cases:** Date, time, datetime, week, month, quarter, year selection.

### `limel-color-picker`
Color selection from design-system swatches with optional manual hex input.

**Key props:** `value`, `label`, `disabled`, `readonly`, `required`, `manualInput`, `palette`
**Use cases:** Assigning colors to categories, tags, or themes.

### `limel-file`
Single-file picker displayed as a chip.

**Key props:** `value`, `label`, `accept`, `disabled`, `readonly`, `required`
**Use cases:** Attaching a single file in a form.

### `limel-file-input`
Wraps any element to open native file chooser on click.

**Key props:** `accept`, `disabled`, `multiple`
**Use cases:** Turning a custom button into a file selector.

### `limel-file-dropzone`
Converts a UI region into a drag-and-drop upload target.

**Key props:** `accept`, `disabled`, `text`, `helperText`
**Use cases:** Drag-and-drop file upload areas.

### `limel-profile-picture`
Circular avatar with image upload support and optional client-side resizing.

**Key props:** `value`, `label`, `icon`, `disabled`, `readonly`, `resize`
**Use cases:** User profile forms and contact cards.

### `limel-form`
JSON-Schema-driven form renderer with automatic validation.

**Key props:** `schema`, `value`, `disabled`, `errors`, `propsFactory`
**Use cases:** Rapidly render validated forms from JSON Schema without manual field composition.

### `limel-text-editor`
Rich text editor (ProseMirror) with markdown/HTML support and formatting toolbar.

**Key props:** `value`, `label`, `contentType`, `ui`, `disabled`, `readonly`, `required`, `triggers`, `customElements`
**Use cases:** Long-form text input (notes, comments). Supports `@`-mentions via triggers.

### `limel-code-editor`
Code editing field (CodeMirror) with syntax highlighting and linting.

**Key props:** `value`, `language`, `label`, `disabled`, `readonly`, `lineNumbers`, `lineWrapping`, `lint`
**Use cases:** Editing JSON, JavaScript, HTML, CSS, or other code in forms/settings.

---

## Data Display

### `limel-list`
Flexible list with plain, selectable, radio, and checkbox modes.

**Key props:** `items`, `type`, `badgeIcons`, `iconSize`
**Use cases:** Collections with optional selection. `type="selectable"` for single, `type="checkbox"` for multi.

### `limel-table`
Full-featured data table with sorting, pagination, selection, and custom cells.

**Key props:** `data`, `columns`, `loading`, `mode`, `selectable`, `sorting`, `pageSize`, `totalRows`
**Use cases:** Tabular data display. `mode="remote"` for server-side paging/sorting.

### `limel-chart`
Data visualization: bar, line, area, pie, doughnut, ring, dot, stacked-bar, NPS.

**Key props:** `items`, `type`, `orientation`, `maxValue`, `loading`
**Use cases:** Dashboard charts and reports.

### `limel-info-tile`
Dashboard metric tile with label, value, badge, and optional progress ring.

**Key props:** `value`, `label`, `icon`, `badge`, `link`, `loading`, `progress`
**Use cases:** Key metrics on start pages and dashboards.

### `limel-circular-progress`
Compact circular progress indicator.

**Key props:** `value`, `maxValue`, `suffix`, `size`
**Use cases:** Completion percentages and scored metrics in constrained spaces.

### `limel-linear-progress`
Horizontal progress bar (determinate or indeterminate).

**Key props:** `value`, `indeterminate`
**Use cases:** Task completion or ongoing process indication.

### `limel-progress-flow`
Horizontal stepper showing named workflow steps.

**Key props:** `flowItems`, `disabled`, `readonly`
**Use cases:** Sales pipeline stages, ticket statuses, wizard steps.

### `limel-code-diff`
Visual diff between two text values (GitHub-style).

**Key props:** `oldValue`, `newValue`, `layout`, `language`, `contextLines`
**Use cases:** Before/after comparison of text or JSON. Supports unified and split views.

### `limel-markdown`
Renders GitHub Flavored Markdown as formatted HTML.

**Key props:** `value`, `whitelist`, `lazyLoadImages`
**Use cases:** Rich text display from markdown strings (help, comments, descriptions).

### `limel-icon`
Renders an icon from the configured icon set.

**Key props:** `name`, `size`, `badge`
**Use cases:** Icons throughout the UI. Sizes: `x-small`, `small`, `medium`, `large`.

### `limel-badge`
Small notification badge with optional numeric/text label.

**Key props:** `label`
**Use cases:** Notification counts on icons, tabs, dock items.

---

## Containers & Surfaces

### `limel-dialog`
Modal overlay for focused interactions.

**Key props:** `open`, `heading`, `fullscreen`, `closingActions`
**Use cases:** Confirmations, forms, complex interactions. Slots: default, `button`, header actions.

### `limel-popover`
Non-modal floating layer anchored to a trigger element.

**Key props:** `open`, `openDirection`
**Use cases:** Contextual options, rich content overlays. Dismisses on outside click.

### `limel-card`
Structured content container with header, media, body, and actions.

**Key props:** `heading`, `subheading`, `icon`, `image`, `actions`, `clickable`, `selected`, `orientation`
**Use cases:** Dashboard items, record previews. Portrait or landscape orientation.

### `limel-collapsible-section`
Toggleable section with header.

**Key props:** `header`, `isOpen`, `icon`, `invalid`, `actions`
**Use cases:** Grouping form fields or content that can be collapsed.

### `limel-header`
Top structural element of a card/modal/view with icon, title, and actions.

**Key props:** `heading`, `icon`, `subheading`, `supportingText`
**Use cases:** Top of cards, dialogs, views. Slot in actions via `"actions"` slot.

---

## Feedback & Messaging

### `limel-snackbar`
Transient toast notification at the bottom of screen.

**Key props:** `message`, `open`, `timeout`, `dismissible`, `actionText`
**Use cases:** Brief feedback (saved, uploaded, failed). `timeout=-1` for persistent.

### `limel-banner`
Persistent message bar at the top of a section.

**Key props:** `message`, `icon`
**Use cases:** Important messages requiring user acknowledgment (outage warnings, required actions).

### `limel-callout`
Highlighted admonition block.

**Key props:** `type`, `heading`, `icon`
**Use cases:** Note, tip, warning, caution, or important callouts in text/forms.

### `limel-spinner`
Loading activity indicator.

**Key props:** `size`, `limeBranded`
**Use cases:** Loading states. `limeBranded` for Lime logo spinner.

### `limel-tooltip`
Descriptive text tooltip shown on hover.

**Key props:** `elementId`, `label`, `helperLabel`, `openDirection`
**Use cases:** Supplemental hints on icon buttons and compact elements.

### `limel-help`
Contextual help button opening a markdown popover.

**Key props:** `value`, `readMoreLink`, `openDirection`
**Use cases:** Inline help for form fields or complex UI sections.

---

## Chips & Tags

### `limel-chip`
Compact interactive element representing a choice, filter, tag, or item.

**Key props:** `text`, `icon`, `badge`, `selected`, `removable`, `disabled`, `readonly`, `type`, `link`
**Use cases:** Tags, filters, selected entities. Use `removable` for deletion, `link` for navigation.

### `limel-chip-set`
Managed collection of chips: choice (single), filter (multi), input (text entry).

**Key props:** `value`, `type`, `label`, `disabled`, `readonly`, `required`, `multiple`, `maxItems`, `delimiter`
**Use cases:** `type="input"` for tag entry, `type="choice"` for exclusive selection, `type="filter"` for multi-select.

---

## Menus

### `limel-menu`
Dropdown context menu with sub-menus, search, and grid layout.

**Key props:** `items`, `open`, `disabled`, `openDirection`, `searcher`, `gridLayout`, `badgeIcons`
**Use cases:** Action lists anchored to a trigger. Supports hierarchy and lazy loading.

---

## Media & Files

### `limel-file-viewer`
Smart component that auto-detects and renders images, audio, video, text, PDF, office docs, email.

**Key props:** `url`, `filename`, `allowDownload`, `allowFullscreen`, `officeViewer`
**Use cases:** Inline preview of attachments with optional download/fullscreen actions.

### `limel-email-viewer`
Renders `.eml` email files with headers, body, and attachments.

**Key props:** (used internally by file-viewer)
**Use cases:** Email preview within file-viewer.

---

## Configuration

### `limel-config`
Global configuration for icon paths, locale, markdown whitelist, and feature switches.

**Key props:** `config`
**Use cases:** Place once at app root. Required for non-Lime-CRM applications.

---

## Common Patterns

### Events
All components emit `CustomEvent<T>`. In JSX:
```tsx
<limel-input-field
    label="Name"
    value={this.name}
    onChange={(e) => { this.name = e.detail; }}
/>
```

### Slots
Use standard Web Component slots for content projection:
```tsx
<limel-dialog open={this.isOpen}>
    <p>Dialog body content</p>
    <limel-button slot="button" label="OK" primary />
</limel-dialog>
```

### Types
Import types from the package:
```ts
import { ListItem, Icon, FormSchema } from '@limetech/lime-elements';
```
