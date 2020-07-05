import { Component, h } from '@stencil/core';

/**
 * Color Example
 *
 * The color of the spinner is set to the color of the `limel-spinner` element,
 * and can be set either explicitly on the element, or by inheriting the value
 * of a parent element.
 */
@Component({
    tag: 'limel-example-spinner-color',
    shadow: true,
})
export class SpinnerColorExample {
    public render() {
        return [
            <limel-spinner style={{ color: 'orange' }} />,
            <div style={{ color: 'blue' }}>
                <limel-spinner />
            </div>,
        ];
    }
}
