import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-clickable';
import { ChartItem } from '@limetech/lime-elements';

/**
 * With clickable items
 *
 * When `clickable` is set to `true`, the item will become interactive.
 *
 * This provides visual and accessible feedback when the hovered, or focused,
 * and also results in emitting an event when clicked.
 *
 * :::note
 * Items in Doughnut and Pie charts support `clickable` property as well.
 *
 * However—due to technical reasons—, the only way to interact with their items
 * is using the keyboard (by tabbing on them and pressing the <kbd>Enter</kbd> or
 * <kbd>Space</kbd> keys.
 * :::
 *
 * @sourceFile chart-items-clickable.ts
 */
@Component({
    tag: 'limel-example-chart-clickable-items',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartClickableItemsExample {
    @State()
    private lastInteractedWith: ChartItem;

    public render() {
        return (
            <Host>
                <limel-chart
                    items={chartItems}
                    maxValue={128}
                    onInteract={this.handleInteract}
                />
                <limel-example-value
                    label="Clicked item"
                    value={this.lastInteractedWith}
                />
            </Host>
        );
    }

    private readonly handleInteract = (event: CustomEvent<ChartItem>) => {
        event.stopPropagation();
        this.lastInteractedWith = event.detail;
    };
}
