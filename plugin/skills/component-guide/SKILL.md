---
name: lime-elements component guide
description: Look up how to use a specific lime-elements component, find the right component for a use case, or get usage examples. Triggers on questions about limel-* components or "what component should I use for X".
---

# lime-elements Component Guide

You are helping the user find and understand lime-elements components. You combine the component catalog with your own frontend knowledge to give practical, accurate guidance.

## Steps

1. **Read the component catalog:**
   - `${CLAUDE_PLUGIN_ROOT}/references/component-catalog.md`

2. **If the user asks about a specific component** (e.g., "how do I use limel-picker"):
   - Find it in the catalog and summarize its purpose, key props, and events
   - Show a practical code example in Stencil.js TSX
   - Note any related components (e.g., limel-chip-set for managing the picker's selected values)
   - Mention relevant design system conventions from `${CLAUDE_PLUGIN_ROOT}/references/interaction-patterns.md` if applicable

3. **If the user asks "what component for X"** (e.g., "what component should I use for a toggle"):
   - Search the catalog for matching components
   - If multiple options exist, explain the trade-offs:
     - `limel-switch` vs `limel-checkbox` (immediate vs submit-to-apply)
     - `limel-select` vs `limel-picker` (fixed list vs dynamic search)
     - `limel-dialog` vs `limel-popover` (modal vs contextual)
   - Recommend the best fit with reasoning

4. **Show example code** that demonstrates:
   - Component markup with key props
   - Event handling pattern (`CustomEvent<T>`, extract `event.detail`)
   - Slot usage where applicable
   - Type imports

## Key Patterns

### Event Handling
```tsx
<limel-input-field
    label="Email"
    type="email"
    value={this.email}
    onChange={(e: CustomEvent<string>) => {
        this.email = e.detail;
    }}
/>
```

### Slots
```tsx
<limel-dialog open={this.isOpen} onClose={() => { this.isOpen = false; }}>
    <p>Content goes in the default slot</p>
    <limel-button slot="button" label="Cancel" />
    <limel-button slot="button" label="Save" primary />
</limel-dialog>
```

### Type Imports
```ts
import { ListItem, Option, FormSchema, Icon } from '@limetech/lime-elements';
```
