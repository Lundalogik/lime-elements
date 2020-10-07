import { Component, h, Prop } from '@stencil/core';
import { abbreviate } from './format';

/**
 * @exampleComponent limel-example-badge
 */
@Component({
    tag: 'limel-badge',
    styleUrl: 'badge.scss',
    shadow: true,
})
export class Badge {
    /**
     * Label to display in the badge
     */
    @Prop({ reflect: true })
    public label: number;

    render() {
        return <div class="badge-container">{abbreviate(this.label)}</div>;
    }
}
