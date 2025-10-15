import { Component, h, Host, State } from '@stencil/core';

const NOTIFICATION_ICON = {
    name: 'notification_alert',
    title: 'Notification alert icon',
    color: 'rgb(var(--color-yellow-default))',
    backgroundColor: 'rgb(var(--color-pink-default))',
};

/**
 * Radio button list items
 *
 * This example shows how list items can be displayed as radio buttons.
 * Radio buttons allow users to select only one option from a group.
 *
 * :::important
 * - Set `role="radiogroup"` on the container for accessibility.
 * - Only one value is selected at a time; clicks and Enter/Space update
 *   `selectedValue` and re-render.
 * :::
 *
 * :::note
 * The radio visuals are purely presentational; state comes from the parent.
 * In production, prefer using `limel-list type="radio"` to centralize logic.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-radio',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemRadioExample {
    @State()
    private selectedValue: number | null = 1; // Pre-select first item

    @State()
    private lastInteraction: string = '';

    private items = [
        { value: 1, text: 'Small (S)', secondaryText: 'Up to 10 items' },
        { value: 2, text: 'Medium (M)', secondaryText: 'Up to 50 items' },
        { value: 3, text: 'Large (L)', secondaryText: 'Up to 100 items' },
        { value: 4, text: 'Extra Large (XL)', secondaryText: 'Over 100 items' },
    ];

    @State()
    private icon?: {
        name: string;
        title: string;
        color: string;
        backgroundColor: string;
    } = NOTIFICATION_ICON;

    @State()
    private badgeIcon = true;

    public render() {
        return (
            <Host>
                <div
                    role="radiogroup"
                    aria-label="Package size"
                    onClick={this.onClick}
                    onKeyDown={this.onKeyDown}
                >
                    {this.items.map((item) => (
                        <limel-list-item
                            key={item.value}
                            data-value={item.value}
                            value={item.value}
                            text={item.text}
                            secondaryText={item.secondaryText}
                            type="radio"
                            selected={this.selectedValue === item.value}
                            tabindex={
                                this.selectedValue === item.value ? 0 : -1
                            }
                            icon={this.icon}
                            badgeIcon={this.badgeIcon}
                        />
                    ))}
                </div>
                <limel-example-value
                    label="Last interaction"
                    value={this.lastInteraction}
                />
                <limel-example-controls>
                    <limel-checkbox
                        checked={!!this.icon}
                        label="icon"
                        onChange={this.setIcon}
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

    private selectValue = (value: number, text: string) => {
        this.selectedValue = value;
        this.lastInteraction = `Selected "${text}"`;
    };

    private onClick = (event: MouseEvent) => {
        const host = (event.target as HTMLElement).closest('limel-list-item');
        if (!host) {
            return;
        }
        const value = Number((host as HTMLElement).dataset.value);
        const text = host.getAttribute('text') || '';
        this.selectValue(value, text);
    };

    private onKeyDown = (event: KeyboardEvent) => {
        const isEnter = event.key === 'Enter';
        const isSpace =
            event.key === ' ' ||
            event.key === 'Space' ||
            event.key === 'Spacebar' ||
            event.code === 'Space';
        if (!isEnter && !isSpace) {
            return;
        }
        if (event.repeat) {
            return;
        }
        if (isSpace) {
            event.preventDefault();
        }
        const focused = (event.target as HTMLElement).closest(
            'limel-list-item'
        );
        if (!focused) {
            return;
        }
        const value = Number((focused as HTMLElement).dataset.value);
        const text = focused.getAttribute('text') || '';
        this.selectValue(value, text);
    };

    private setBadgeIcon = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.badgeIcon = event.detail;
    };

    private setIcon = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.icon = event.detail ? NOTIFICATION_ICON : undefined;
    };
}
