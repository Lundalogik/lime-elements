import { LimelProsemirrorAdapterCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Basic example
 *
 * Try typing and editing text, or copy & paste in some rendered HTML code
 * from your browser into the editor to see how it is rendered and what you get
 * as an output value.
 */
@Component({
    tag: 'limel-example-prosemirror-adapter-basic',
    shadow: true,
})
export class ProsemirrorAdapterBasicExample {
    @State()
    private text: string = '';

    public render() {
        return [
            <limel-prosemirror-adapter onChange={this.handleChange} />,
            <limel-example-value value={this.text} />,
        ];
    }

    private handleChange = (
        event: LimelProsemirrorAdapterCustomEvent<string>,
    ): void => {
        event.stopPropagation();

        this.text = event.detail;
    };
}
