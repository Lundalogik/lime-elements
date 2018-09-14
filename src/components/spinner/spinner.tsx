import { Component, Prop } from '@stencil/core';

@Component({
    tag: 'limel-spinner',
    shadow: true,
    styleUrl: 'spinner.scss',
})
export class Spinner {
    /**
     * Determines the size of the spinner. Possible values: `mini`, `x-small`, `small`, `medium`, `large`. Defaults to `mini`.
     */
    @Prop({ reflectToAttr: true })
    public size: string;

    public render() {
        return '';
    }
}
