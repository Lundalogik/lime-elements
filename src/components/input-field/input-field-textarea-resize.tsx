import { Component, h } from '@stencil/core';

/**
 * Input Field of Type Textarea
 */
@Component({
    tag: 'limel-example-input-field-textarea-resize',
    shadow: true,
    styleUrl: 'input-field-textarea-resize.scss',
})
export class InputFieldTextareaResizeExample {
    public render() {
        const MAX_LENGTH = 500;

        return [
            <limel-input-field
                label="Resize me"
                type="textarea"
                helperText="This can be resized"
                maxlength={MAX_LENGTH}
            />,
            <limel-input-field
                class="non-resizable"
                label="Resize me"
                type="textarea"
                helperText="This cannot be resized"
                maxlength={MAX_LENGTH}
            />,
            <limel-input-field
                class="vertically-resizable"
                label="Resize me"
                type="textarea"
                helperText="This cannot be resized"
                maxlength={MAX_LENGTH}
            />,
        ];
    }
}
