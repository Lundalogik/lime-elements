import { Component, h, State } from '@stencil/core';
/**
 * Adding a custom node
 */
@Component({
    tag: 'limel-example-text-editor-custom-node',
    shadow: true,
})
export class TextEditorCustomNodeExample {
    @State()
    private value: string = '<limel-chip text="Github" icon="github_copyrighted"/>';

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                plugins={[{tagName: 'limel-chip', attrs: ['text', 'icon']}]}
            />,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
