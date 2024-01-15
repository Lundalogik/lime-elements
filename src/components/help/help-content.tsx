import { Component, Prop, h } from '@stencil/core';
import { Link } from '../../interface';

/**
 * Help content
 * This is scrollable content that is placed in the popover of the Help component.
 * Moved here mostly to avoid having inlined styles in the parent component.
 * Since you cannot send styles to the Portal component, we need to have this
 * child component.
 *
 * @private
 */
@Component({
    tag: 'limel-help-content',
    shadow: true,
    styleUrl: 'limel-help-content.scss',
})
export class HelpContent {
    @Prop()
    public value: string;

    @Prop()
    public readMoreLink?: Link;

    public render() {
        return [
            <limel-markdown value={this.value} />,
            this.renderReadMoreLink(),
        ];
    }

    private renderReadMoreLink = () => {
        if (!this.readMoreLink) {
            return;
        }

        return (
            <span>
                <a
                    href={this.readMoreLink?.href}
                    target={this.readMoreLink?.target}
                    title={this.readMoreLink?.title}
                    tabindex="0"
                >
                    {this.readMoreLink?.text}
                </a>
            </span>
        );
    };
}
