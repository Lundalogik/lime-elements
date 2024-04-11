import { LimelTextEditorCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Basic example
 *
 * Try typing and editing text, or copy & paste in some rendered HTML code
 * from your browser into the editor to see how it is rendered and what you get
 * as an output value.
 */
@Component({
    tag: 'limel-example-text-editor-basic',
    shadow: true,
})
export class BasicTextEditorBasicExample {
    @State()
    private text: { html: string } = { html: '' };

    public render() {
        return [
            <limel-text-editor onChange={this.handleChange} />,
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
