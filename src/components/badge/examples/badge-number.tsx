import { Component, h } from '@stencil/core';

/**
 * Number badges
 *
 * Numeric labels larger than 999 will get both rounded and abbreviated.
 * For example, if the label is `1090` the badge will display `1.1K`.
 * Abbreviation units used are `k` (Kilo) that stands for Thousands,
 * `M` for Millions, `B` for Billions, and `T` for Trillions.
 *
 * When users hover the abbreviated badge, the complete
 * `label` will be displayed in a tooltip.
 */
@Component({
    tag: 'limel-example-badge-number',
    styleUrl: 'badge-number.scss',
    shadow: true,
})
export class BadgeExample {
    private label1: number = 5;
    private label2: number = 995;
    private label3: number = 9951;
    private label4: number = 999_990;

    public render() {
        return [
            <limel-badge label={this.label1} />,
            <limel-badge label={this.label2} />,
            <limel-badge label={this.label3} />,
            <limel-badge label={this.label4} />,
        ];
    }
}
