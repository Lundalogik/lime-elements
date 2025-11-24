import { Component, h, State } from '@stencil/core';
import { data } from '../../table/examples/birds';

/**
 * Editable with JSON linting, folding, and line wrapping
 * Here you see an instance of the Code Editor component with linting,
 * folding, and line wrapping support. Linting allows the user to see syntax
 * errors in the JSON code. Folding makes it easier to collapse larger pieces
 * of code. Line wrapping ensures long lines wrap to the next line instead of
 * requiring horizontal scrolling, improving readability in constrained spaces.
 */

@Component({
    tag: 'limel-example-code-editor-fold-lint-wrap',
    shadow: true,
    styleUrl: 'code-editor.scss',
})
export class CodeFoldLintAndWrapExample {
    @State()
    private json: string = JSON.stringify(
        [
            ...data.slice(0, -1),
            {
                ...data.at(-1),
                habitat:
                    'Found in wetlands, marshes, lakes, rivers, and coastal areas across North America, Europe, Asia, Africa, and Australia. They prefer shallow water with abundant vegetation.',
            },
        ],
        null,
        '    '
    );

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
                lineWrapping={true}
                onChange={this.handleChange}
            />
        );
    }
}
