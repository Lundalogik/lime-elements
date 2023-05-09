import { Component, h } from '@stencil/core';

/**
 * Help with custom open direction
 */
@Component({
    tag: 'limel-example-open-direction',
    shadow: true,
})
export class HelpOpenDirectionExample {
    public render() {
        return (
            <limel-help
                openDirection="right"
                value="This popover is opened on the right side of the trigger."
            />
        );
    }
}
