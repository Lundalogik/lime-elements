import { Component, Prop } from '@stencil/core';
import { SpinnerSize } from './spinner.types';

@Component({
    tag: 'limel-spinner',
    shadow: true,
    styleUrl: 'spinner.scss',
})
export class Spinner {
    /**
     * Determines the size of the spinner.
     */
    @Prop({ reflectToAttr: true })
    public size: SpinnerSize = 'mini';

    public render() {
        return '';
    }
}
