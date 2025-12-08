import { Component, h, State } from '@stencil/core';
/**
 * Text editor in markdown mode.
 *
 * When using the text editor in markdown mode the `value` property is expected to contain
 * a markdown formatted string and the output will likewise be markdown. This is the default
 * if no value for `contentType` is provided.
 */
@Component({
    tag: 'limel-example-text-editor-with-markdown',
    shadow: true,
})
export class TextEditorWithMarkdownExample {
    @State()
    private value: string = '*Hello*, **markdown**!';

    @State()
    private readonly = false;

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                readonly={this.readonly}
                contentType="markdown"
            />,
            <limel-example-controls>
                <limel-switch
                    value={this.readonly}
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
