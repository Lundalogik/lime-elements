import { Component, h } from '@stencil/core';

/**
 * Displaying a notification badge
 *
 * The component can display a badge, which could either be a `number` or
 * a `string`. Read more about how the badge truncates or abbreviates the
 * provided label [here](#/component/limel-badge/).
 */
@Component({
    tag: 'limel-example-info-tile-badge',
    shadow: true,
    styleUrl: 'info-tile-badge.scss',
})
export class InfoTileBadgeExample {
    private NumberBadge: number = 6;
    private NumberValue: number = 23;

    private StringBadge: string = '···';
    private StringValue: string = '23,89';

    public render() {
        return [
            <limel-info-tile
                icon="doctors_bag"
                label="Active support tickets"
                value={this.NumberValue}
                badge={this.NumberBadge}
                link={{ href: '#' }}
            />,
            <limel-info-tile
                icon="water"
                label="Average weekly usage"
                value={this.StringValue}
                suffix="L"
                badge={this.StringBadge}
                link={{ href: '#' }}
            />,
        ];
    }
}
