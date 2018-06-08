import { Component } from '@stencil/core';

@Component({
    tag: 'limel-button-group',
    styleUrl: 'button-group.less',
    shadow: true
})
export class ButtonGroup {
    render() {
        return (
            <slot />
        );
    }
}
