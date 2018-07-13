import { Component } from '@stencil/core';

@Component({
    tag: 'docs-limel-button',
    shadow: true,
})
export class ButtonExample {
    public render() {
        return (
            <limel-button-group reverse-order={true}>
                <limel-button label="Save" primary={true} />
                <limel-button label="Cancel" />
            </limel-button-group>
        );
    }
}
