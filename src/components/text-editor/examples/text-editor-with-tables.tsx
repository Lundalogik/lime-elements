import { Component, h, State } from '@stencil/core';
/**
 * Text editor with tables (HTML mode only).
 *
 * Basic table support is available when using the text editor in `HTML` mode.
 * This allows you to paste and display tables in the text editor.
 * Complex operations are not supported, adding and removing columns are not supported.
 *
 * Tables will only appear as expected in text-editor fields that are in `HTML` mode.
 */
@Component({
    tag: 'limel-example-text-editor-with-tables',
    shadow: true,
})
export class TextEditorWithTablesExample {
    @State()
    private value: string = `<table><tbody>
        <tr>
        <td style="background-color: rgb(25, 107, 36);color: white;"><p><strong>Column1</strong></p></td>
        <td style="background-color: rgb(25, 107, 36);color: white;"><p><strong>Column2</strong></p></td>
        </tr>
        <tr>
        <td style="background-color: rgb(193, 240, 200);color: black;"><p>Cell A1</p></td>
        <td style="background-color: rgb(193, 240, 200);color: black;"><p>Cell B1</p></td>
        </tr>
        <tr>
        <td style="background-color: yellow;color: red;"><p>Cell A2</p></td>
        <td style="background-color: yellow;color: red;"><p>Cell B2</p></td>
        </tr>
        </tbody></table>`;

    @State()
    private readonly = false;

    public render() {
        return [
            <limel-text-editor
                key="html-editor"
                value={this.value}
                onChange={this.handleChange}
                readonly={this.readonly}
                contentType="html"
            />,
            <limel-example-controls key="controls">
                <limel-switch
                    value={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
            </limel-example-controls>,
            <limel-example-value key="example-value" value={this.value} />,
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
