import { LimelInputFieldCustomEvent } from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';

/**
 * Composite example
 * Test your markdown code and see what you get in return in real-time.
 */
@Component({
    tag: 'limel-example-markdown-composite',
    styleUrl: 'markdown-composite.scss',
    shadow: true,
})
export class MarkdownRenderContentExample {
    @State()
    private markdown = '# Hello, world!\n\nThis is **markdown**!';

    public render() {
        return [
            <limel-input-field
                label="Markdown to render"
                type="textarea"
                value={this.markdown}
                onChange={this.handleMarkdownChange}
            />,
            <fieldset>
                <legend>Rendered markdown</legend>
                <limel-markdown value={this.markdown} />
            </fieldset>,
        ];
    }

    private handleMarkdownChange = (
        event: LimelInputFieldCustomEvent<string>,
    ) => {
        this.markdown = event.detail;
    };
}
