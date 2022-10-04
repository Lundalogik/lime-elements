import { Component, Prop, h } from '@stencil/core';
import { abbreviate } from './format';

/**
 * The Badge component can display both `number` and `string` as `label`.
 *
 * @exampleComponent limel-example-badge-number
 * @exampleComponent limel-example-badge-string
 */
@Component({
    tag: 'limel-badge',
    styleUrl: 'badge.scss',
    shadow: true,
})
export class Badge {
    /**
     * Label to display in the badge.
     * Numeric labels larger than 999 will be rounded and abbreviated.
     * String labels get truncated if their visual length is longer than
     * six characters (six `0`s to be exact).
     */
    @Prop({ reflect: true })
    public label: number | string;

    public render() {
        if (typeof this.label === 'number') {
            return <span>{abbreviate(this.label)}</span>;
        } else if (typeof this.label === 'string') {
            return <span>{this.label}</span>;
        }
    }
}
