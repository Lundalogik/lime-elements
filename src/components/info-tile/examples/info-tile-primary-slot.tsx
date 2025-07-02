import { Component, h } from '@stencil/core';
import { InfoTileProgress } from '@limetech/lime-elements';
import { chartItems } from '../../chart/examples/chart-items-stack';

/**
 * Using the primary slot
 * The component offers a primary slot that can be used to display
 * any custom content.
 *
 * :::important
 * 1. If there is a component to be displayed in the primary slot,
 * the info tile won't render the inbuilt progress bar.
 * 1. The primary slot has an aspect ratio of 1:1, so the content
 * will be displayed in a square area.
 * :::
 */
@Component({
    tag: 'limel-example-info-tile-primary-slot',
    shadow: true,
    styleUrl: 'info-tile.scss',
})
export class InfoTilePrimarySlotExample {
    public render() {
        const link = {
            href: '#',
            title: 'Click to see further details',
            target: '_blank',
        };

        const progress: InfoTileProgress = {
            value: 76,
        };

        return (
            <div>
                <limel-info-tile
                    icon="cloud_storage"
                    label="Cloud storage usage"
                    value="215"
                    suffix="GB"
                    link={link}
                    progress={progress} // won't be rendered
                >
                    <limel-chart
                        slot="primary"
                        items={chartItems}
                        type="doughnut"
                    />
                </limel-info-tile>
            </div>
        );
    }
}
