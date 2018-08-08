import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-button',
    shadow: true,
})
export class ButtonExample {
    public render() {
        return (
            <limel-button-group reverse-order={true}>
                <limel-button label="Save" primary={true} />
                <limel-button label="Cancel" />
                <limel-button label="disabled" disabled={true} />
            </limel-button-group>
        );
    }
}
