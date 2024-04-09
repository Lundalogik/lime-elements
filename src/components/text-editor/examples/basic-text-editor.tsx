import { LimelTextEditorCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * A basic text editor example.
 */
@Component({
    tag: 'limel-example-basic-text-editor',
    shadow: true,
    styleUrl: 'basic-text-editor.scss',
})
export class BasicTextEditorExample {
    @State()
    private text: { html: string } = { html: '' };

    public render() {
        return (
            <div>
                <limel-text-editor onChange={this.handleChange} />
                <hr />
                <h2>Preview using limel-markdown:</h2>
                <limel-markdown value={this.text.html} />
                <hr />
                <limel-example-value value={this.text} />
            </div>
        );
    }

    private handleChange = (
        event: LimelTextEditorCustomEvent<{ html: string }>,
    ): void => {
        event.stopPropagation();
        this.text = event.detail;
    };
}
