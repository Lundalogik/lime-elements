import { Component, h } from '@stencil/core';

/**
 * String badges
 *
 * String labels get truncated if their visual length is longer than
 * six characters placed side by side (six `0`s to be exact).
 *
 * When users hover the truncated badge, the complete
 * `label` will be displayed in a tooltip.
 */
@Component({
    tag: 'limel-example-badge-string',
    styleUrl: 'badge-string.scss',
    shadow: true,
})
export class BadgeExample {
    private label0: string = '·';
    private label1: string = 'NEW';
    private label2: string = 'pretty';
    private label3: string = 'Element';

    public render() {
        return [
            <limel-badge label={this.label0} />,
            <limel-badge label={this.label1} />,
            <limel-badge label={this.label2} />,
            <limel-badge label={this.label3} />,
        ];
    }
}
