import { Component } from '@stencil/core'; // tslint:disable-line:no-implicit-dependencies

@Component({
    styleUrl: 'button-group.scss',
    tag: 'limel-button-group',
})
export class ButtonGroup {
    public render() {
        return <slot />;
    }
}
