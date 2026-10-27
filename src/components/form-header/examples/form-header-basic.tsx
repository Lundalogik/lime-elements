import { Component, h } from '@stencil/core';

/**
 * Basic example
 * The heading, the description and the help of a field. The description is
 * markdown.
 *
 * :::note
 * `limel-form` sets the size and the weight of the headings by how deep
 * they are in the form, and puts the help in the corner of the field.
 * Outside a form, the heading and the help keep the default look of the
 * browser, as in these examples.
 * :::
 */
@Component({
    tag: 'limel-example-form-header-basic',
    shadow: true,
})
export class FormHeaderBasicExample {
    public render() {
        return (
            <limel-form-header
                heading="Contact"
                description="How we reach **you**. Use your work details."
                help="We only use these details to answer your questions."
            />
        );
    }
}
