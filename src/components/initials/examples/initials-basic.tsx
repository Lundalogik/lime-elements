import { Component, h } from '@stencil/core';

/**
 * Basic example
 *
 * Give the component a `name`, and it shows the initials of that name.
 * Here, "Maja Lindqvist" becomes "ML".
 */
@Component({
    tag: 'limel-example-initials-basic',
    shadow: true,
})
export class InitialsBasicExample {
    public render() {
        return <limel-initials name="Maja Lindqvist" />;
    }
}
