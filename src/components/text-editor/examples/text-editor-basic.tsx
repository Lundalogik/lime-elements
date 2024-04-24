import { Component, h, State } from '@stencil/core';
/**
 * Basic example
 */
@Component({
    tag: 'limel-example-text-editor-basic',
    shadow: true,
})
export class TextEditorBasicExample {
    @State()
    private value: string;

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
            />,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
