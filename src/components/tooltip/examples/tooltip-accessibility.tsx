import { Component, Fragment, h, Host } from '@stencil/core';

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
 * [`aria-description`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-description)
 * on the element matching that id, from the tooltip's `label` and
 * `helperLabel`. If that element passes the focus on to an element inside
 * itself, as `limel-button` does, the description is set on the element
 * inside. Screen readers read it as the description of the trigger when it
 * gets focus, whether or not the tooltip is visible at that moment.
 * When the `label` only repeats the name that the trigger already has, the
 * component leaves it out, so that it is not read twice. The `hotkey` is part
 * of the description too, written out in words, like "Command Shift S".
 *
 * A description is not a *name*. If the trigger has no accessible name of
 * its own, a screen reader will announce the description but there is nothing
 * to describe — the control is unnamed. This is an accessibility bug in the
 * trigger, not something the tooltip can fix.
 *
 * #### Where the name comes from, for each kind of trigger
 *
 * The three triggers below show how different lime-elements components get
 * their accessible name:
 *
 * 1. **`limel-icon`** — the host is what the user focuses. An `aria-label`
 *    only counts on an element that has a role, so the host gets
 *    `role="img"`, and then `aria-label` is the name. Without the role, a
 *    screen reader announces an empty group.
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
 * #### Native elements
 *
 * The tooltip works the same on native elements, like `<button>`, `<a href>`,
 * `<input>` and `<select>`, as long as they are in the same document or shadow
 * root as the tooltip. A `div` that is made to act as a button needs a `role`
 * and a `tabindex` to be a control for assistive technology; the tooltip can
 * not do that for it.
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
 * to see the computed name and description, or move focus to them with a
 * screen reader running._
 */
@Component({
    tag: 'limel-example-tooltip-accessibility',
    shadow: true,
    styleUrl: 'tooltip-accessibility.scss',
})
export class TooltipAccessibilityExample {
    public render() {
        return (
            <Host>
                <limel-icon
                    tabIndex={0}
                    role="img"
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
                {this.renderNativeElements()}
            </Host>
        );
    }

    private renderNativeElements() {
        return (
            <Fragment>
                <button id="tooltip-a11y-3" type="button">
                    Save as draft
                </button>
                <limel-tooltip
                    label="Keeps the document unpublished"
                    elementId="tooltip-a11y-3"
                />
                <button id="tooltip-a11y-4" type="button" aria-label="Delete">
                    <limel-icon name="trash" size="small" aria-hidden="true" />
                </button>
                <limel-tooltip
                    label="Delete"
                    helperLabel="Moves the item to the trash"
                    elementId="tooltip-a11y-4"
                />
                <a id="tooltip-a11y-5" href="#tooltip-a11y-5">
                    Release notes
                </a>
                <limel-tooltip
                    label="Opens the list of changes"
                    elementId="tooltip-a11y-5"
                />
                <input
                    id="tooltip-a11y-6"
                    type="text"
                    aria-label="Project name"
                />
                <limel-tooltip
                    label="Use a short and unique name"
                    elementId="tooltip-a11y-6"
                />
                <select id="tooltip-a11y-7" aria-label="Language">
                    <option>English</option>
                    <option>Svenska</option>
                </select>
                <limel-tooltip
                    label="Sets the language of the interface"
                    elementId="tooltip-a11y-7"
                />
                <div id="tooltip-a11y-8" role="button" tabIndex={0}>
                    Custom button
                </div>
                <limel-tooltip
                    label="Acts as a button, but is not a native one"
                    elementId="tooltip-a11y-8"
                />
            </Fragment>
        );
    }
}
