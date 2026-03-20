# lime-elements Interaction Patterns Reference

## Switch vs. Checkbox

**Rule of thumb:**
- **Switch**: Use when the toggle takes **immediate effect** without a submit/save action.
- **Checkbox**: Use when the user must **confirm or submit** their choices for them to take effect.

Examples:
- Settings page toggle for dark mode → **Switch** (instant effect)
- Terms & conditions agreement in a form → **Checkbox** (submitted with form)

---

## Labeling Boolean Fields

Labels depend on context:

### In Settings Pages
Label = the feature name (a noun). E.g., "Dark mode", "Notifications", "Auto-save".

### In Forms
Label = a descriptive phrase or sentence. E.g., "I agree to the terms and conditions". Use helper text for clarification.

### In Task Lists / Checklists
Label = a positively-phrased statement:
- Use prefixes like "is", "has", "can", "should"
- Avoid negatives: "Is active" not "Is not inactive"
- Be specific: "Subscribed for newsletters" not "Newsletter"

### In Readonly Mode
Provide **two labels** (for true/false states) via `readonlyLabels`. A single label with just a visual toggle is ambiguous to readers. Enhance with icons and colors for clarity.

**Best practices:**
1. Avoid single-noun labels in checklists/readonly
2. Use positive phrasing
3. Avoid negatives ("Is active" not "Is inactive")
4. Be specific about what the boolean represents
5. Consider context — "Is active" under a "Coworker" section should be "Is still working"

---

## Disabled vs. Readonly

These are distinct states with different semantics:

### Disabled
- The field is **temporarily non-interactive**
- It **can become enabled** if the user changes something else in the UI
- Renders as a recognizable input field with visual dimming
- Implies: "You can't use this yet, but you might be able to soon"

### Readonly
- The field is **permanently non-editable** regardless of user actions
- Used purely for **data visualization** — showing values the user cannot change
- Does NOT render as an interactive input element
- Implies: "This is display-only information"

**When to use which:**
- User lacks permission to edit a field they can see → `readonly`
- Field depends on another field's value → `disabled` (until dependency is met)
- Showing computed or system-set values → `readonly`
- Feature not available in current plan/role → `readonly`

---

## Hiding vs. Disabling Interactive Elements

**When to hide:**
- The action is irrelevant to the user's current task or context
- Showing it would only add clutter without informational value
- The user has no reason to know the action exists right now

**When to disable (but keep visible):**
- The user needs to know the action **exists** but can't use it yet
- The disabled state communicates what the user needs to do to enable it
- Removing it would be confusing (e.g., a "Save" button that appears/disappears)

**Combined with visual hints:**
A disabled "Save" button should be accompanied by:
- Highlighted invalid fields
- Validation error messages
- Clear indication of what's blocking the action

---

## Action Buttons

### Placement (LTR layouts)
- Action buttons go in the **bottom-right** of dialogs/forms
- **Positive action** (Save, Next, Continue) → **right side**
- **Negative action** (Cancel, Back, Discard) → **left side**

`limel-dialog` has a `slot="button"` flexbox that auto-aligns to the right.

### Primary vs. Secondary
- Mark the expected/promoted action as `primary={true}` — it gets the theme's primary color
- For **risky or irreversible** actions, consider making the safer option primary instead

### Label Best Practices
- Use **verbs** that describe the action: "Save", "Delete", "Send" — not "OK" or "Yes"
- Labels should make sense as a pair: "Save" / "Discard", "Confirm" / "Cancel"
- Be explicit: "Delete conversation" is better than "Delete"

### Third Alternative (3 buttons)
For unsaved-changes prompts: "Save" (right) / "Discard" (right) / "Go back" (left, separated).
Push the back button left with:
```scss
.back-button {
    justify-self: flex-start;
    margin-right: auto;
}
```

### Colors and Icons
- Use colors to **communicate meaning**, not decoration
- Red for destructive actions, green for safe/positive ones
- Icons reinforce the label's meaning
- Don't over-emphasize secondary actions when the primary action isn't risky
