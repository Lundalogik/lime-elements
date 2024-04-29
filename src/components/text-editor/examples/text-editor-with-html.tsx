import { Component, h, State } from '@stencil/core';
/**
 * Text editor in HTML mode.
 *
 * When using the text editor in HTML mode the `value` property is expected to contain
 * an html formatted string and the output will likewise be html.
 */
@Component({
    tag: 'limel-example-text-editor-with-html',
    shadow: true,
})
export class TextEditorWithHtmlExample {
    @State()
    private value: string = '<em>Hello</em>, <strong>html</strong>!';

    @State()
    private readonly = false;

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                readonly={this.readonly}
                contentType="html"
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
