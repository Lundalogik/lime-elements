import { Component, h } from '@stencil/core';
/**
 * Example with click handler
 */
@Component({
    tag: 'limel-example-shortcut-with-click-handler',
    shadow: true,
    styleUrl: 'shortcut.scss',
})
export class ShortcutWithClickHandlerExample {
    public render() {
        return (
            <limel-shortcut
                icon="pivot_table"
                label="limel-table"
                linkTitle="Open the documentation for limel-table"
                href="#/component/limel-table"
                onClick={this.handleClick}
            />
        );
    }

    private handleClick = (event: PointerEvent) => {
        if (
            !(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        ) {
            event.preventDefault();
            alert(
                "No modifier key pressed. Link should open in current window, but we might want to handle the navigation with our application's router, to avoid reloading the whole application (if we're in a single page app, like Lime CRM Web Client).\n\nTry holding down a modifier key, like Shift, while clicking."
            );
        }
    };
}
