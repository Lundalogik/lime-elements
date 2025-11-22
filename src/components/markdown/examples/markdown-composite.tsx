import {
    LimelInputFieldCustomEvent,
    LimelMarkdownCustomEvent,
} from '@limetech/lime-elements';
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
    private markdown = `# Hello, world!

This is **markdown**!

- [x] test
- [x] test

## Task Lists

- [ ] This is an unchecked task
- [x] This is a completed task
  - [ ] Nested unchecked task
  - [x] Nested completed task
- [ ] Another unchecked task`;

    public render() {
        return (
            <div>
                <limel-input-field
                    label="Markdown to render"
                    type="textarea"
                    value={this.markdown}
                    onChange={this.handleMarkdownChange}
                />
                <fieldset>
                    <legend>Rendered markdown</legend>
                    <limel-markdown
                        value={this.markdown}
                        onTaskListChange={this.handleTaskListChange}
                    />
                </fieldset>
            </div>
        );
    }

    private handleMarkdownChange = (
        event: LimelInputFieldCustomEvent<string>
    ) => {
        this.markdown = event.detail;
    };

    private handleTaskListChange = (
        event: LimelMarkdownCustomEvent<string>
    ) => {
        this.markdown = event.detail;
    };
}
