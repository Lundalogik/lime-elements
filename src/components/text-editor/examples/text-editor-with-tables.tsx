import { Component, h, State } from '@stencil/core';
/**
 * Text editor with tables (HTML mode only).
 *
 * When using the text editor in HTML mode, it is possible to paste and
 * display tables in the text editor.
 * Basic interaction with the table is supported, but you cannot do
 * complex operations
 */
@Component({
    tag: 'limel-example-text-editor-with-tables',
    shadow: true,
})
export class TextEditorWithTablesExample {
    @State()
    private value: string =
        '<table><tbody><tr><td style="background-color: rgb(25, 107, 36);color: white;"><p><strong>Column1</strong></p></td><td style="background-color: rgb(25, 107, 36);color: white;"><p><strong>Column2</strong></p></td></tr><tr><td style="background-color: rgb(193, 240, 200);color: black;"><p>Cell A1</p></td><td style="background-color: rgb(193, 240, 200);color: black;"><p>Cell B1</p></td></tr><tr><td style="color: black;"><p>Cell A2</p></td><td style="background-color: yellow;color: red;"><p>Cell B2</p></td></tr></tbody></table>';

    @State()
    private readonly = false;

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                readonly={this.readonly}
                contentType="html"
                enableTables={true}
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
