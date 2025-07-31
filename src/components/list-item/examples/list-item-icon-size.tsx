import { Component, h, Host, State } from '@stencil/core';
import {
    IconSize,
    type Option,
    type LimelSelectCustomEvent,
} from '@limetech/lime-elements';

/**
 * Icon size
 *
 * Control the icon size of list items via the `iconSize` prop.
 * By default, the icon size is set to `small`, but some
 * components may allow setting a different size.
 */
@Component({
    tag: 'limel-example-list-item-icon-size',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemIconSizeExample {
    @State()
    private badgeIcon = false;

    @State()
    private iconSize: IconSize = 'small';

    public render() {
        return (
            <Host>
                <ul>
                    <limel-list-item
                        value={1}
                        tabindex="0"
                        text="Apple"
                        secondaryText="a delicious fruit"
                        icon={{
                            name: 'apple',
                            color: 'rgb(var(--color-red-default))',
                        }}
                        badgeIcon={this.badgeIcon}
                        iconSize={this.iconSize}
                    />
                    <limel-list-item
                        value={2}
                        tabindex="0"
                        text="Dragon"
                        secondaryText="a mythical creature"
                        icon={{
                            name: 'dragon',
                            color: 'rgb(var(--color-white))',
                            backgroundColor: 'rgb(var(--color-gray-default))',
                        }}
                        badgeIcon={this.badgeIcon}
                        iconSize={this.iconSize}
                    />
                </ul>
                <limel-example-controls>
                    <limel-select
                        label="iconSize"
                        value={this.getSelectedOption()}
                        options={this.getIconSizeOptions()}
                        onChange={this.handleSizeChange}
                    />
                    <limel-checkbox
                        checked={this.badgeIcon}
                        label="badgeIcon"
                        onChange={this.setBadgeIcon}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleSizeChange = (
        event: LimelSelectCustomEvent<Option<IconSize>>
    ) => {
        event.stopPropagation();
        const option = event.detail;
        this.iconSize = option?.value ?? 'small';
    };

    private getIconSizeOptions(): Array<Option<IconSize>> {
        const sizes: IconSize[] = ['x-small', 'small', 'medium', 'large'];
        return sizes.map((s) => ({ text: s, value: s }));
    }

    private getSelectedOption(): Option<IconSize> {
        return { text: this.iconSize, value: this.iconSize };
    }

    private setBadgeIcon = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.badgeIcon = event.detail;
    };
}
