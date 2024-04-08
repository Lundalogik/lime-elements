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
        return [this.renderTextEditor(), this.renderEventPreview()];
    }

    private renderTextEditor() {
        return <limel-text-editor onChange={this.handleChange} />;
    }

    private renderEventPreview() {
        return <limel-example-value value={this.text} />;
    }

    handleChange = (
        event: LimelTextEditorCustomEvent<{ html: string }>,
    ): void => {
        event.stopPropagation();
        this.text = event.detail;
    };
}
