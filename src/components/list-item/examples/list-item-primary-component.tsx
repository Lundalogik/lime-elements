import { Component, h, Host, State } from '@stencil/core';
import { ListSeparator, MenuItem } from '@limetech/lime-elements';

/**
 * Primary component in a list item
 *
 * This example shows how to render a custom primary component inside
 * `limel-list-item` using the `primaryComponent` prop.
 *
 * :::note
 * By default, the primary component is rendered after the icon,
 * and before the item's text.
 *
 * Since the list item is a flex box, you can easily change the
 * order of the primary component by applying a different `order` as
 * a style. This could be done either via the primary component's own
 * styles, or via its `props` in the list.
 * :::
 *
 * :::note
 * The primary component does not become automatically disabled,
 * once the list item is disabled. Clicks on, or interactions with the component
 * will still be registered on disabled items.
 * The consumer should handle the disabled state of their components accordingly.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-primary-component',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemPrimaryComponentExample {
    @State()
    private disabled = false;

    private actionItems: Array<MenuItem | ListSeparator> = [
        { text: 'Edit', value: 'edit', icon: 'edit' },
        { text: 'Duplicate', value: 'duplicate', icon: 'copy' },
        { text: 'Share', value: 'share', icon: 'share' },
        { separator: true },
        { text: 'Delete', value: 'delete', icon: 'trash', disabled: true },
    ];

    public render() {
        const primaryComponentTwo = {
            name: 'limel-badge',
            props: {
                label: 'NEW',
                style: {
                    order: 2,
                    '--badge-background-color':
                        'rgb(var(--color-orange-light))',
                },
            },
        };

        const primaryComponentOne = {
            name: 'limel-spinner',
            props: {
                size: 'mini',
            },
        };
        const primaryComponentThree = {
            name: 'limel-circular-progress',
            props: {
                value: 12,
                maxValue: 100,
                suffix: '%',
                displayPercentageColors: true,
                size: 'small',
                style: {
                    order: 3,
                },
            },
        };

        return (
            <Host>
                <ul>
                    <limel-list-item
                        text="Loading..."
                        icon="clock"
                        disabled={this.disabled}
                        primaryComponent={primaryComponentOne}
                    />
                    <limel-list-item
                        text="Project Apollo"
                        secondaryText="Owner: Jane Doe"
                        icon="rocket"
                        disabled={this.disabled}
                        primaryComponent={primaryComponentThree}
                        actions={this.actionItems}
                    />
                    <limel-list-item
                        text="Design Review"
                        secondaryText="Tomorrow 10:00"
                        icon="calendar"
                        disabled={this.disabled}
                        primaryComponent={primaryComponentTwo}
                    />
                </ul>
                <limel-example-controls>
                    <limel-switch
                        label="Disabled"
                        value={this.disabled}
                        onChange={this.setDisabled}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };
}
