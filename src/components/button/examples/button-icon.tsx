import { Component, h, Host } from '@stencil/core';

/**
 * Proper usage of icons
 *
 * Sometimes, your design requires displaying a single icon inside a button,
 * without any visible label.
 *
 * In such scenarios, the `title` property of the icon must be used to
 * improve accessibility for unsighted users.
 *
 * When a proper `label` is chosen for a button, it is descriptive enough for
 * the users to understand the meaning of the action.
 * In such cases, the icon is primarily used to improve
 * the visual appearance of the item, and make it more quickly and easily recognizable
 * for the users.
 *
 * However, some designs favor a cleaner and more minimal user interface,
 * by removing unnecessary words, relying on an already present icon which
 * can be interpreted as a word by the user.
 *
 * Here you see examples of such icons followed by a short text:
 * - **➕ icon followed by "Todo"**: For a sighted user,
 * this combination of icon and text would be interpreted as "Add New Todo"
 * - **🔄 icon followed by "List"**: Would be visually read as "Refresh List"
 * - **🗑️ icon followed by "Selected"**: Would be visually read as "Delete Selected"
 *
 * For sighted users, the text is enough to understand the meaning of the action,
 * but a screen reader cannot interpret the icon as a word, unless you provide a
 * proper `title` property for the icon. In fact, the icons that have no `title`
 * are completely hidden from the screen readers.
 *
 * This example showcases how user experience can be improved not only for both
 * users of assistive technologies, but also for those who see a descriptive tooltip,
 * while hovering the action, which is constructed from the combination of
 * the `title` and `text`.
 */
@Component({
    tag: 'limel-example-button-icon',
    shadow: true,
})
export class ButtonIconExample {
    public render() {
        return (
            <Host>
                <limel-example-do-do-not
                    doDescription="The icon has an accessible and descriptive `title` for its `icon`."
                    doNotDescription="The button has no `label`, and no `title` for the `icon`."
                >
                    <limel-button
                        slot="do"
                        icon={{
                            name: 'plus_math',
                            title: 'Add New To-do',
                        }}
                    />
                    <limel-button slot="do-not" icon="plus_math" />
                </limel-example-do-do-not>
                <limel-example-do-do-not
                    doDescription="The icon has an `title` for its `icon`, which can be combined by the `label` to create an accessible experience for users of assistive technologies like screen readers."
                    doNotDescription="The button has a `label`, but no `title` for the `icon`. Sighted users can see icon and interpret it together the `label`. However, screen readers only read out the label, which is not descriptive alone."
                >
                    <limel-button
                        slot="do"
                        icon={{
                            name: 'plus_math',
                            title: 'Add New',
                        }}
                        label="To-do"
                    />
                    <limel-button
                        slot="do-not"
                        icon="plus_math"
                        label="To-do"
                    />
                </limel-example-do-do-not>
                <limel-example-do-do-not
                    doDescription="The button uses an accessible and descriptive tooltip. This provides a great experience for sighted users, and those who use screen readers."
                    doNotDescription="The button has no `label`, no `title` for the `icon`, and no tooltip or other accessible attributes."
                >
                    <div slot="do">
                        <limel-button
                            icon={{
                                name: 'plus_math',
                                title: 'Add New To-do',
                            }}
                            id="button"
                        />
                        <limel-tooltip
                            elementId="button"
                            label="Add New To-do"
                        />
                    </div>
                    <limel-button slot="do-not" icon="plus_math" />
                </limel-example-do-do-not>
            </Host>
        );
    }
}
