import { Component, h, Method, Prop } from '@stencil/core';
import { MarkdownDescribable } from '@limetech/lime-elements';

/**
 * Made just to showcase a feature in a docs example for `limel-markdown`.
 * @private
 */
@Component({
    tag: 'limel-example-markdown-person-chip',
    shadow: true,
})
export class MarkdownPersonChipExample implements MarkdownDescribable {
    @Prop()
    public name: string;

    @Prop()
    public email: string;

    @Method()
    public async toMarkdown(): Promise<string> {
        const text = this.name.replaceAll(/[\\[\]]/g, String.raw`\$&`);

        return `[${text}](mailto:${this.email})`;
    }

    public render() {
        return (
            <limel-chip
                text={this.name}
                icon="user"
                link={{ href: `mailto:${this.email}` }}
            />
        );
    }
}
