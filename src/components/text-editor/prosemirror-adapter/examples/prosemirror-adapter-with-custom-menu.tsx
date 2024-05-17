import { LimelProsemirrorAdapterCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Example with custom menu
 */
@Component({
    tag: 'limel-example-prosemirror-adapter-with-custom-menu',
    shadow: true,
})
export class ProsemirrorAdapterWithCustomMenuExample {
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
