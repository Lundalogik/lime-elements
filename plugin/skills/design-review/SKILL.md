---
name: lime-elements design review
description: Review UI code for compliance with the lime-elements design system — colors, sizing, shadows, interaction patterns, decluttering, and component usage. Triggers on requests to review UI, check design, or verify design system compliance.
---

# lime-elements Design Review

You are reviewing UI code for compliance with the lime-elements design system. You combine the design system rules with your own UI/UX expertise to provide actionable feedback.

## Steps

1. **Read the reference docs:**
   - `${CLAUDE_PLUGIN_ROOT}/references/design-system.md`
   - `${CLAUDE_PLUGIN_ROOT}/references/interaction-patterns.md`
   - `${CLAUDE_PLUGIN_ROOT}/references/component-catalog.md`

2. **Read the user's code** thoroughly before commenting.

3. **Check against each design system area.** For each issue found, provide:
   - What's wrong
   - Which rule it violates
   - A specific fix

### Color System Checklist
- [ ] Uses CSS custom properties, not hardcoded hex/rgb values
- [ ] Colors are written as `rgb(var(--color-xxx))` or `rgba(var(--color-xxx), alpha)`
- [ ] Uses `--lime-elevated-surface-background-color` for elevated surfaces
- [ ] Only one accent color via `--lime-primary-color`
- [ ] Neutral UI uses contrast scale, not intense colors on large surfaces
- [ ] Colors communicate meaning, not decoration

### Sizing Checklist
- [ ] All spacing values are multiples of 4 (in rem)
- [ ] Uses rem units, not px (except for 1px borders)
- [ ] No `0.0625rem` for borders — use `1px`

### Shadow Checklist
- [ ] Uses shadow CSS variables, not custom `box-shadow` values
- [ ] Shadow transitions are smooth (`transition: box-shadow 0.2s ease`)
- [ ] Shadows reserved for interactivity, hierarchy, temporary elements — not section dividers
- [ ] Button shadows use `--button-shadow-normal/hovered/pressed`

### Interaction Patterns Checklist
- [ ] Switch for instant-effect, checkbox for submit-to-apply
- [ ] Boolean labels follow conventions (positive phrasing, context-appropriate)
- [ ] Disabled vs readonly used correctly (disabled = temporarily blocked, readonly = display only)
- [ ] Action buttons: positive right, negative left, verb labels
- [ ] Primary action is visually distinct; safer option may be primary for risky actions

### Declutter Checklist
- [ ] Helper text and supplemental info shown only when relevant
- [ ] Disabled buttons hidden when they don't inform the user
- [ ] Tooltips used for occasional/supplemental info
- [ ] No unnecessary visual elements

### Component Usage Checklist
- [ ] Correct component chosen for the use case (see catalog)
- [ ] Events handled via `CustomEvent<T>` pattern
- [ ] Slots used correctly (e.g., `slot="button"` in dialogs)
- [ ] No misuse of internal/private components

4. **Apply general UI/UX judgment** beyond the design system rules:
   - Layout and visual hierarchy
   - Consistency
   - User flow and efficiency
   - Error handling and feedback

5. **Summarize findings** organized by severity:
   - **Must fix:** Design system violations
   - **Should fix:** UX improvements
   - **Consider:** Nice-to-have enhancements
