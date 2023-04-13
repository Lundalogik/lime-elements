import { Component, h } from '@stencil/core';

/**
 * How default layout of header works
 * All content of a header by default are placed on a horizontal row.
 * This will always render the headings on the left side, and the actions
 * on the right side.
 *
 * In small containers when having the default layout, the `actions` area
 * wins the battle of limited space! It means, if you have a very wide
 * component in the actions area, it will never shrink in size, and instead
 * forces the headings to truncate.
 *
 * :::tip
 * Users can still hover the cursor on the truncated headings to read the full
 * text.
 * :::
 *
 */

@Component({
    tag: 'limel-example-header',
    shadow: true,
})
export class HeaderExample {
    public render() {
        return (
            <limel-header
                icon="brake_warning"
                heading="Useful information"
                subheading="Note"
                supportingText="Data couldn't be loaded!"
            >
                <limel-icon-button
                    slot="actions"
                    icon="multiply"
                    label="Close"
                    onClick={this.handleActionClick()}
                />
            </limel-header>
        );
    }

    private handleActionClick = () => (event: MouseEvent) => {
        event.stopPropagation();
        console.log('close');
    };
}
