import { LimelTextEditorCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * A basic text editor example.
 */
@Component({
    tag: 'limel-example-text-editor',
    shadow: true,
})
export class BasicTextEditorExample {
    @State()
    private text: { html: string } = { html: '' };

    public render() {
        return [
            <limel-text-editor onChange={this.handleChange} />,
            <hr />,
            <h2>Preview using limel-markdown:</h2>,
            <limel-markdown value={this.text.html} />,
            <hr />,
            <limel-example-value value={this.text} />,
        ];
    }

    private handleChange = (
        event: LimelTextEditorCustomEvent<{ html: string }>,
    ): void => {
        event.stopPropagation();
        this.text = event.detail;
    };
}
