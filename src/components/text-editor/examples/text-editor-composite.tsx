import { Component, h, State } from '@stencil/core';
/**
 * Composite example
 */
@Component({
    tag: 'limel-example-text-editor-composite',
    shadow: true,
})
export class TextEditorCompositeExample {
    @State()
    private value: string = 'Hello, world!';

    @State()
    private readonly = false;

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                readonly={this.readonly}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
