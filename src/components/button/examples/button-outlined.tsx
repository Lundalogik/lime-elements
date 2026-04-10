import { Component, h } from '@stencil/core';

/**
 * Outlined button
 *
 * Setting `outlined={true}` gives the button a visible border
 * while keeping its background transparent. It sits between a
 * primary and a default button in terms of visual weight.
 *
 * ### When to use
 * The outlined variant is meant for a very specific scenario:
 * when you need a **three-level button hierarchy** within the
 * same context — a primary action, a supporting alternative,
 * and a dismissive action. In that case:
 *
 * 1. The **primary** button represents the main action (e.g. "Save").
 * 2. The **outlined** button represents a notable alternative
 *    (e.g. "Save as draft").
 * 3. The **default** button represents the least prominent action
 *    (e.g. "Cancel").
 *
 * ### When _not_ to use
 * - **Do not** use `outlined` when there is no primary button
 *   on the same screen. Without a primary button to contrast
 *   against, the outlined style loses its meaning and becomes
 *   arbitrary visual noise.
 * - **Do not** use `outlined` as a general-purpose alternative to
 *   the default button. If you only need two levels of emphasis,
 *   use `primary` + default — that covers the vast majority
 *   of scenarios.
 * - **Do not** use `outlined` purely for decoration or because it
 *   "looks different". Consistency matters more than variety.
 *
 * :::tip
 * The need for three distinct button levels is rare. Most interfaces
 * work well with just primary + default buttons.
 * If you are unsure, skip `outlined` and use the default variant.
 * :::
 *
 * :::note
 * If you find yourself needing multiple related actions alongside a
 * primary action, consider using a
 * [Split button](#/component/limel-split-button/) instead.
 * It groups alternative actions behind a dropdown, keeping the UI
 * clean while still offering choices.
 * :::
 */
@Component({
    tag: 'limel-example-button-outlined',
    shadow: true,
})
export class ButtonOutlinedExample {
    public render() {
        return <limel-button label="My Button" outlined={true} />;
    }
}
