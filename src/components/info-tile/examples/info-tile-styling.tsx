import { Component, h } from '@stencil/core';
import { InfoTileProgress } from '@limetech/lime-elements';

/**
 * How to style the Info tile
 *
 * The component offers different CSS variables for styling
 * the color of the text, background, and it's icon; as well as
 * radius of it's rounded corners, and colors of the notification badge
 * and its text.
 */
@Component({
    tag: 'limel-example-info-tile-styling',
    shadow: true,
    styleUrl: 'info-tile-styling.scss',
})
export class InfoTileStylingExample {
    private value: string = '4 876';
    private badge: number = 3;

    private progress: InfoTileProgress = {
        value: 12,
        maxValue: 100,
        suffix: '%',
        displayPercentageColors: false,
    };

    public render() {
        return [
            <limel-info-tile
                icon="electricity"
                label="Average weekly usage"
                value={this.value}
                suffix="kWh"
                badge={this.badge}
            />,
            <limel-info-tile
                label="Average weekly usage"
                icon="electricity"
                value={this.value}
                suffix="kWh"
                progress={this.progress}
                prefix="↑"
            />,
        ];
    }
}
