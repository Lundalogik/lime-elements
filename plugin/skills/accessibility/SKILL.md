---
name: lime-elements accessibility audit
description: Audit UI code for accessibility compliance — WCAG 2.1 AA, ARIA, keyboard navigation, focus management, and lime-elements-specific patterns (disabled vs readonly, hidden vs disabled). Triggers on requests to check accessibility, a11y audit, or WCAG compliance.
---

# lime-elements Accessibility Audit

You are auditing UI code for accessibility, combining WCAG 2.1 AA standards with lime-elements-specific conventions. lime-elements components have built-in accessibility features, but consuming code must use them correctly.

## Steps

1. **Read the reference docs for lime-elements-specific patterns:**
   - `${CLAUDE_PLUGIN_ROOT}/references/interaction-patterns.md` — disabled vs readonly, hidden vs disabled, boolean labeling
   - `${CLAUDE_PLUGIN_ROOT}/references/component-catalog.md` — component props that affect accessibility

2. **Read the user's code** thoroughly.

3. **Audit against each category below.** For each issue, report:
   - Severity: **Critical** (blocks users), **Major** (significant barrier), **Minor** (inconvenience)
   - WCAG criterion (if applicable)
   - What's wrong
   - How to fix it

### Perceivable (WCAG 1.x)

**1.1 Text Alternatives**
- [ ] Images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Icon-only buttons have accessible labels (`label` prop on `limel-icon-button`)
- [ ] Charts and data visualizations have text alternatives

**1.3 Adaptable**
- [ ] Content structure uses semantic HTML (headings, lists, tables)
- [ ] Information is not conveyed by color alone
- [ ] `limel-list` uses correct `type` for selection semantics

**1.4 Distinguishable**
- [ ] Text meets 4.5:1 contrast ratio (3:1 for large text)
- [ ] Focus indicators are visible (lime-elements provides these via `--lime-primary-color`)
- [ ] Content is readable at 200% zoom
- [ ] No text in images

### Operable (WCAG 2.x)

**2.1 Keyboard Accessible**
- [ ] All interactive elements are keyboard reachable
- [ ] No keyboard traps
- [ ] Custom keyboard shortcuts don't conflict with browser/AT defaults
- [ ] `limel-dialog` traps focus correctly (built-in) and returns focus on close

**2.4 Navigable**
- [ ] Page has a logical heading structure
- [ ] Focus order follows visual reading order
- [ ] `limel-breadcrumbs` provides navigation context
- [ ] Interactive elements have visible focus styles

**2.5 Input Modalities**
- [ ] Touch targets are at least 44x44 CSS pixels
- [ ] `limel-file-dropzone` also provides click/keyboard alternative
- [ ] Gestures have single-pointer alternatives

### Understandable (WCAG 3.x)

**3.1 Readable**
- [ ] Language is set on the page (`lang` attribute)
- [ ] `limel-date-picker` and `limel-snackbar` receive correct `language` prop

**3.2 Predictable**
- [ ] No unexpected context changes on focus or input
- [ ] Navigation is consistent
- [ ] `limel-switch` only used for instant-effect toggles (matches user expectation)

**3.3 Input Assistance**
- [ ] Required fields have `required` prop set
- [ ] Error messages are descriptive (`helperText` on invalid fields)
- [ ] `invalid` prop is set on fields with errors
- [ ] `limel-form` validation errors are clearly associated with fields

### Robust (WCAG 4.x)

**4.1 Compatible**
- [ ] Custom elements follow Web Components standards (lime-elements handles this)
- [ ] ARIA roles and properties are used correctly
- [ ] No conflicting ARIA attributes

### lime-elements-Specific Patterns

**Disabled vs Readonly**
- [ ] `disabled` used for temporarily non-interactive fields (can become enabled)
- [ ] `readonly` used for permanently non-editable display-only fields
- [ ] Screen readers correctly announce both states (lime-elements handles this internally)

**Hidden vs Disabled**
- [ ] Hidden elements are truly removed from DOM/tab order (not just visually hidden)
- [ ] Disabled buttons are visible when they inform the user about requirements
- [ ] Hidden actions don't break the user's mental model

**Boolean Field Labels**
- [ ] Boolean fields have descriptive labels (not just nouns)
- [ ] `readonlyLabels` provided for readonly boolean fields
- [ ] Labels use positive phrasing ("Is active" not "Is not inactive")

**Dialogs and Modals**
- [ ] `limel-dialog` receives a `heading` for screen readers
- [ ] Dialog content is meaningful without visual context
- [ ] Action buttons have descriptive verb labels (not "OK" / "Yes")

4. **Summarize findings** with severity counts and prioritized fix list.
