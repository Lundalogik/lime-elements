import { Component, h } from '@stencil/core';

/**
 * Elevated
 *
 * An alternative button style, which helps communicate that this is a button
 * which can be clicked.
 */
@Component({
    tag: 'limel-example-icon-button-elevated',
    shadow: true,
})
export class IconButtonElevatedExample {
    public render() {
        return (
            <limel-icon-button
                label="Add favourite"
                icon="heart_outlined"
                elevated={true}
            />
        );
    }
}
