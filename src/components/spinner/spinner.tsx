import { SpinnerSize } from '@limetech/lime-elements';
import { Component, Prop } from '@stencil/core';

/**
 * @exampleComponent limel-example-spinner
 * @exampleComponent limel-example-spinner-color
 */
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
