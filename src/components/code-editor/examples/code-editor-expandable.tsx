import { Component, h, State } from '@stencil/core';
import { data } from '../../table/examples/birds';

/**
 * Expand Code Editor to Full View
 * The `expandable` instance is a prop that can be disabled.
 * In default mode, the expand button appears on focus and opens up a fullscreen dialog with the same editor instance.
 * Changes will be reflected in both places.
 */

@Component({
    tag: 'limel-example-code-editor-expandable',
    shadow: true,
    styleUrl: 'code-editor.scss',
})
export class CodeEditorExpandableExample {
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
                expandable={false}
            />
        );
    }
}
