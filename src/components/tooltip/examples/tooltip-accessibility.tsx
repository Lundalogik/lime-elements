import { Component, h, Host } from '@stencil/core';

/**
 * Accessibility & the accessible name
 *
 * A tooltip is *supplementary* information — it is **not** a substitute for
 * an [accessible name](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name)
 * on the trigger element. Make sure every element the tooltip is attached to
 * already has a name that assistive technologies can read.
 *
 * #### How the tooltip plugs into ARIA
 *
 * When you place `<limel-tooltip elementId="…">` next to a trigger, the
 * component sets
 * [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby)
 * on the element matching that id, pointing to the tooltip's content (which
 * carries `role="tooltip"`). This follows the [WAI-ARIA Authoring Practices
 * for the tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).
 *
 * `aria-describedby` provides a *description*, not a *name*. If the trigger
 * has no accessible name of its own, a screen reader will announce the
 * description but there is nothing to describe — the control is unnamed.
 * This is an accessibility bug in the trigger, not something the tooltip can
 * fix.
 *
 * #### Where the name comes from, for each kind of trigger
 *
 * The three triggers below show how different lime-elements components get
 * their accessible name:
 *
 * 1. **`limel-icon`** — the host is what the user focuses, so `aria-label`
 *    on the host is the name.
 * 2. **`limel-icon-button`** — the required `label` prop is rendered as
 *    `aria-label` on the inner `<button>`, which makes it the accessible
 *    name. The same prop also drives the component's built-in tooltip on
 *    hover and focus, so this trigger does not need an external
 *    `<limel-tooltip>` attached to it — it already has one. `icon.title` is
 *    not a name source: it describes what the icon visually depicts (e.g.
 *    icon={{ name: 'search', title: 'Magnifying glass' }})
 *    and is announced as supplementary content. For
 *    decorative icons inside a labelled button, leave it unset and the icon
 *    will be marked `aria-hidden`.
 * 3. **`limel-button`** — the visible `label` prop is rendered as text
 *    inside the inner `<button>`, so the name is computed automatically from
 *    that text content.
 *
 * #### Rules of thumb
 *
 * 1. Icon-only triggers must carry their own name, even if it duplicates the
 *    tooltip's `label`. The tooltip is a visual hint for sighted hover/focus
 *    users; the name is what screen reader users hear as the control's
 *    identity.
 * 2. Triggers with visible text already have a name. Keep the tooltip
 *    focused on supplementary info like a keyboard shortcut via `hotkey`, or
 *    extra context via `helperLabel`.
 * 3. Don't use a tooltip where a label belongs. If the information is
 *    essential to operating the control, put it in the UI directly. Don't
 *    hide it behind hover.
 *
 * _Inspect the triggers below in the browser's DevTools Accessibility panel
 * to see the computed name and description._
 */
@Component({
    tag: 'limel-example-tooltip-accessibility',
    shadow: true,
    styleUrl: 'tooltip-max-character.scss',
})
export class TooltipAccessibilityExample {
    public render() {
        return (
            <Host>
                <limel-icon
                    tabIndex={0}
                    size="small"
                    name="search"
                    aria-label="Search"
                    id="tooltip-a11y-0"
                />
                <limel-tooltip
                    label="Search"
                    hotkey="ctrl+f"
                    elementId="tooltip-a11y-0"
                />
                <limel-icon-button
                    elevated={true}
                    icon="search"
                    label="Search"
                    helperLabel="Find on this page"
                    id="tooltip-a11y-1"
                />
                <limel-button id="tooltip-a11y-2" icon="save" label="Save" />
                <limel-tooltip
                    label="Persist the current draft"
                    hotkey="meta+s"
                    elementId="tooltip-a11y-2"
                />
            </Host>
        );
    }
}
