import { Component, h, State } from '@stencil/core';

/**
 * Markdown formatting
 *
 * The `message` property supports [Markdown](#/component/limel-markdown/)
 * syntax. This lets you lightly emphasize a single word with `**bold**`
 * or `*italic*` so the reader can scan the feedback more quickly.
 *
 * In this example, the entity name *"Westeros Ltd."* is rendered in bold,
 * and the ticket reference `#1374` is escaped with a leading backslash
 * (`\#1374`) to prevent it from being interpreted as a Markdown heading.
 *
 * :::important
 * Keep the feedback short and brief. A snackbar is a quick, ignorable
 * nudge — not a place for rich content. Avoid complex Markdown such as
 * headings, lists, tables, images, blockquotes, or long links. These
 * push content off screen, add visual noise, and undermine the
 * snackbar's purpose.
 *
 * If you need more than a single sentence, or the information is
 * important enough to require the user's attention, reach for a
 * [Banner](#/component/limel-banner/) or
 * [Dialog](#/component/limel-dialog/) instead.
 * :::
 *
 * :::important
 * When the message is composed from dynamic content such as user
 * input or translated strings, escape Markdown-sensitive characters
 * (`*`, `_`, backtick, `#`, `[`, `]`) with a leading backslash to
 * prevent unintended formatting.
 * :::
 */
@Component({
    tag: 'limel-example-snackbar-with-markdown',
    shadow: true,
})
export class SnackbarWithMarkdownExample {
    @State()
    private isOpen: boolean = false;

    public render() {
        return [
            <limel-button
                key="button"
                label="Save company"
                onClick={this.handleShowSnackbar}
            />,
            <limel-snackbar
                key="snackbar"
                open={this.isOpen}
                message='\\#1374 — **"Westeros Ltd."** was saved successfully.'
                onHide={this.handleHideSnackbar}
            />,
        ];
    }

    private readonly handleShowSnackbar = () => {
        this.isOpen = true;
    };

    private readonly handleHideSnackbar = () => {
        this.isOpen = false;
    };
}
