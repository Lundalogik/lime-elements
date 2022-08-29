import { Component, h, State } from '@stencil/core';
import { data } from '../../table/examples/birds';

/**
 * Editable with JSON linting and folding
 * Here you see an instance of the Code Editor component with linting and
 * folding support, which allows the user to see syntax errors in the JSON
 * code shown in the editor. Folding makes it easier to collapse larger pieces
 * of code.
 */

@Component({
    tag: 'limel-example-code-editor-fold-lint',
    shadow: true,
    styleUrl: 'code-editor.scss',
})
export class CodeFoldAndLintExample {
    @State()
    private json: string = JSON.stringify(data, null, '    ');

    private handleChange = (event: CustomEvent<string>) => {
        this.json = event.detail;
    };

    public render() {
        return (
            <limel-code-editor
                value={this.json}
                language="json"
                lineNumbers={true}
                lint={true}
                fold={true}
                onChange={this.handleChange}
            />
        );
    }
}
