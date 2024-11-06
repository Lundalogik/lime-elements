import { Component, h, State } from '@stencil/core';
/**
 * A custom element can be configured
 *
 * The default behavior of the text editor is to only allow standard HTML element
 * like `em` and `h`. To add your own custom elements one can add custom elements
 * passing them to the `plugins` property.
 *
 * In this example we pass `limel-chip` as a custom element along with the allowed
 * attributes `text` and `icon`.
 */
@Component({
    tag: 'limel-example-text-editor-custom-element',
    shadow: true,
})
export class TextEditorCustomElementExample {
    @State()
    private value: string =
        "This chip doesn't fit " +
        '<limel-chip text="Github" icon="github_copyrighted">nested element</limel-chip>';

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                customElements={[
                    {
                        tagName: 'limel-chip',
                        attributes: ['text', 'icon'],
                    },
                ]}
            />,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
