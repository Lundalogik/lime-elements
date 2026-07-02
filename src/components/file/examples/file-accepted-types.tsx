import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Limit accepted file types
 *
 * The `accept` prop limits which file types the picker offers, using the
 * standard [file type specifiers](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file#unique_file_type_specifiers):
 * a comma-separated list of MIME types (e.g. `image/png`) or extensions (e.g.
 * `.png`). It only filters what the file dialog offers — it is a hint, not a
 * guarantee — so validate on the server as well.
 *
 * Rather than listing the allowed types in the `label`, use `helperText` to
 * describe them below the field.
 */
@Component({
    tag: 'limel-example-file-accepted-types',
    shadow: true,
})
export class FileAcceptedTypesExample {
    @State()
    private value: FileInfo = { filename: 'picture.jpg', id: 123 };

    @State()
    private required = false;

    public render() {
        return [
            <limel-file
                label="Attach an image"
                helperText="Allowed types: PNG and JPEG"
                onChange={this.handleChange}
                required={this.required}
                value={this.value}
                accept="image/jpeg,image/png"
            />,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };
}
