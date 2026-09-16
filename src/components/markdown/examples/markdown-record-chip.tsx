import { Component, h, Method, Prop } from '@stencil/core';
import { MarkdownRepresentable } from '@limetech/lime-elements';

/**
 * A chip standing in for a record, used by the `toMarkdown` example.
 * It renders as a chip, and describes itself as a markdown link.
 */
@Component({
    tag: 'limel-example-markdown-record-chip',
    shadow: true,
})
export class MarkdownRecordChipExample implements MarkdownRepresentable {
    /**
     * The record's display name.
     */
    @Prop()
    public name: string;

    /**
     * Where the record can be opened.
     */
    @Prop()
    public href: string;

    /**
     * The chip as a markdown link, for text that leaves the page.
     *
     * @returns the link, as markdown
     */
    @Method()
    public async toMarkdown(): Promise<string> {
        return `[${this.name}](${this.href})`;
    }

    public render() {
        return (
            <limel-chip
                text={this.name}
                icon="user"
                link={{ href: this.href, target: '_blank' }}
            />
        );
    }
}
