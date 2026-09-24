---
name: Build UI with lime-elements
description: Build user interfaces using lime-elements web components, applying the design system's color, sizing, shadow, and interaction conventions. Triggers on requests to build forms, pages, dialogs, or UIs with lime-elements.
---

# Build UI with lime-elements

You are helping the user build a user interface using `@limetech/lime-elements`, a Stencil.js web component library. You will combine the lime-elements design system with your own UI/UX design, accessibility (WCAG 2.1 AA), and frontend best practices.

## Steps

1. **Read the reference docs** to ground your output in the design system:
   - `${CLAUDE_PLUGIN_ROOT}/references/component-catalog.md` — find the right components
   - `${CLAUDE_PLUGIN_ROOT}/references/design-system.md` — color, sizing, shadow, declutter rules
   - `${CLAUDE_PLUGIN_ROOT}/references/interaction-patterns.md` — switch vs checkbox, disabled vs readonly, action buttons

2. **Understand the user's requirements.** Ask clarifying questions if the scope is ambiguous. Identify:
   - What data is being displayed or collected?
   - What actions does the user need?
   - What's the context (dialog, full page, card, form)?
   - **Does the user want a Stencil component or standalone HTML?** Default to Stencil for projects that already use it. Default to standalone HTML for quick prototyping, demos, or non-Stencil projects.

3. **Choose components.** Select the most appropriate `limel-*` components from the catalog. Prefer:
   - `limel-form` for schema-driven forms over manually composing individual fields
   - `limel-picker` for large/dynamic datasets, `limel-select` for small fixed lists
   - `limel-switch` for instant-effect toggles, `limel-checkbox` for submit-to-apply
   - `limel-dialog` for focused interactions, `limel-popover` for contextual options

4. **Write the code.** Output working Stencil.js TSX or standalone HTML depending on step 2. Follow these conventions:

   **For standalone HTML output:** Read `${CLAUDE_PLUGIN_ROOT}/references/quick-start.md` first. You **must** include the full loading boilerplate: all 3 files (color-palette-extended.css, lime-elements.css, lime-elements.esm.js), `limel-config` with iconPath, z-index variables, and a note about serving via HTTP (not file://). Use vanilla JS event listeners (`addEventListener`) instead of JSX handlers.

   For all output formats, follow these conventions:
   - **Colors:** Use CSS custom properties from the color system. Set `--lime-primary-color` for accent. Use `--lime-elevated-surface-background-color` for cards/modals. Use contrast scale for neutral UI.
   - **Sizing:** All spacing in multiples of 4, using rem units. `1px` for borders only.
   - **Shadows:** Use `--button-shadow-*` for buttons, surface shadow variables for cards/modals. Transition shadow changes smoothly.
   - **Declutter:** Show details progressively. Hide disabled buttons that don't inform. Use tooltips for occasional info.
   - **Action buttons:** Positive action on right, negative on left. Use verbs as labels. Mark primary action with `primary={true}`.
   - **Accessibility:** Proper labels, ARIA attributes, keyboard navigation, focus management, sufficient contrast.

5. **Explain your choices** briefly — which components you picked and why, and any design system rules you applied.

## Key Reminders
- Events are `CustomEvent<T>` — extract `event.detail` in handlers
- Use `slot="button"` for dialog action buttons
- Import types: `import { ListItem, Icon, FormSchema } from '@limetech/lime-elements'`
- Colors are RGB triples: `rgb(var(--color-blue-default))`
- One accent color only via `--lime-primary-color`
- UI should be neutrally colored — reserve color for meaning
