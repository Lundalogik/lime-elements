# lime-elements-toolkit

A Claude Code plugin that helps developers build UIs with `@limetech/lime-elements`. It bundles the lime-elements design system knowledge, component guidance, and best practices — so Claude can help you write code that follows the design system correctly.

## Installation

```bash
# From the lime-elements repo
claude --plugin-dir ./plugin

# Or install from a path
claude plugin install ./plugin
```

## Skills

### Build UI (`build`)
Build user interfaces using lime-elements components, with the design system's color, sizing, shadow, and interaction conventions applied automatically.

**Triggers on:** "build a form", "create a dialog", "implement a page with lime-elements", "make a UI for..."

### Component Guide (`component-guide`)
Look up how to use a specific component, find the right component for a use case, or get usage examples with correct event handling and slot patterns.

**Triggers on:** "how do I use limel-button", "what component for a toggle", "show me how to use the picker"

### Design Review (`design-review`)
Review existing UI code for compliance with the lime-elements design system — colors, sizing, shadows, interaction patterns, and declutter principles.

**Triggers on:** "review my UI code", "check my design", "does this follow the design system"

### Accessibility Audit (`accessibility`)
Audit UI code for WCAG 2.1 AA compliance, plus lime-elements-specific patterns like disabled vs readonly, hidden vs disabled, and boolean field labeling.

**Triggers on:** "check accessibility", "a11y audit", "WCAG compliance check"

## Agents

### UI Assistant (`ui-assistant`)
An orchestration agent that coordinates all four skills into a structured, multi-phase workflow. It classifies your request, runs the relevant phases in order, and fixes any issues found during review.

**Phases:** Component Selection → Build → Design Review → Accessibility Audit → Fix

**Use it for:**
- Full build requests: "Build me a settings dialog with a switch and save button"
- Code reviews: "Review this form against the design system"
- Targeted audits: "Check accessibility on my dialog code"
- Component guidance: "What component should I use for file upload?"

**Invoke with:** `@ui-assistant` or "use the ui-assistant agent"

## Reference Docs

The plugin bundles distilled design system knowledge in `references/`:

- **`design-system.md`** — Color system (palettes, CSS variables, dark mode, accent color), size rhythms (4x rule, rem units), shadows (button/surface/state variables), declutter philosophy
- **`component-catalog.md`** — All ~50 public components with tag names, key props, and use cases
- **`interaction-patterns.md`** — Switch vs checkbox, disabled vs readonly, hidden vs disabled, action button placement and labeling
- **`quick-start.md`** — Standalone HTML loading pattern (required CSS/JS files, CDN URLs, limel-config setup, complete minimal working example)

## What This Plugin Does NOT Do

- It does not replace reading the [full documentation](https://lundalogik.github.io/lime-elements/)
- It does not cover lime-elements internals or contribution guidelines
- It does not include every prop/event — consult component readmes for exhaustive API docs

## License

Apache-2.0 (same as lime-elements)
