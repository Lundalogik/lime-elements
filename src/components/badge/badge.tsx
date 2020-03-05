import { Component, h, Prop } from '@stencil/core';
import NumAbbr from 'number-abbreviate';

@Component({
    tag: 'limel-badge',
    styleUrl: 'badge.scss',
    shadow: true,
})
export class Badge {
    /**
     * Label to display in the badge
     */
    @Prop({ reflectToAttr: true })
    public label: number;

    showRoundedNumber() {
        if (typeof this.label !== 'number') {
            return '';
        }

        const units = ['k', 'M', 'B', 'T'];

        const numAbbr = new NumAbbr(units);

        return numAbbr.abbreviate(this.label, 1);
    }

    render() {
        return <div class="badge-container">{this.showRoundedNumber()}</div>;
    }
}
