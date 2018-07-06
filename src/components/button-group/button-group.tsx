import { Component } from '@stencil/core';

@Component({
    tag: 'limel-button-group',
    styleUrl: 'button-group.scss',
})
export class ButtonGroup {
    public render() {
        return <slot />;
    }
}
