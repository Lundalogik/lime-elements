import { Component, Prop } from '@stencil/core';

@Component({
    tag: 'limel-spinner',
    styleUrl: 'spinner.scss',
    shadow: true,
})
export class Spinner {
    @Prop({ reflectToAttr: true })
    public size: string;

    public render() {
        return '';
    }
}
