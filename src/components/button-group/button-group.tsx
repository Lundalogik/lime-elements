import { Component } from '@stencil/core';

@Component({
    styleUrl: 'button-group.scss',
    tag: 'limel-button-group',
})
export class ButtonGroup {
    public render() {
        return <slot />;
    }
}
