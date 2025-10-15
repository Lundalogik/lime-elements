import { Component, h, Host, State } from '@stencil/core';

const NOTIFICATION_ICON = {
    name: 'notification_alert',
    title: 'Notification alert icon',
    color: 'rgb(var(--color-yellow-default))',
    backgroundColor: 'rgb(var(--color-pink-default))',
};

/**
 * Checkbox list items
 *
 * This example shows how list items can be displayed as checkboxes.
 * Checkboxes allow users to select multiple options from a group.
 *
 * :::important
 * - Apply `role="group"` to the container for accessibility.
 * - Selection logic is fully managed by the parent example via click and
 *   key delegation; each item receives `selected` based on `selectedValues`.
 * :::
 *
 * :::note
 * The checkboxes are presentational only. For production usage prefer
 * a container component (`limel-list type="checkbox"`) to centralize state.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-checkbox',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemCheckboxExample {
    @State()
    private selectedValues: Set<number> = new Set([2]); // Pre-select second item

    @State()
    private lastInteraction: string = '';

    @State()
    private icon?: {
        name: string;
        title: string;
        color: string;
        backgroundColor: string;
    } = NOTIFICATION_ICON;

    @State()
    private badgeIcon = true;

    private items = [
        {
            value: 1,
            text: 'Email notifications',
            secondaryText: 'Receive updates via email',
        },
        {
            value: 2,
            text: 'Push notifications',
            secondaryText: 'Receive updates on your device',
        },
        {
            value: 3,
            text: 'SMS notifications',
            secondaryText: 'Receive updates via text message',
        },
        {
            value: 4,
            text: 'Newsletter',
            secondaryText: 'Weekly product updates and tips',
        },
    ];

    public render() {
        return (
            <Host>
                <ul
                    role="group"
                    aria-label="Notification preferences"
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
                            type="checkbox"
                            selected={this.selectedValues.has(item.value)}
                            icon={this.icon}
                            badgeIcon={this.badgeIcon}
                        />
                    ))}
                </ul>
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

    private toggleValue = (value: number, text: string) => {
        const selected = this.selectedValues.has(value);
        if (selected) {
            this.selectedValues = new Set(
                [...this.selectedValues].filter((id) => id !== value)
            );
            this.lastInteraction = `Deselected "${text}"`;
        } else {
            this.selectedValues = new Set([...this.selectedValues, value]);
            this.lastInteraction = `Selected "${text}"`;
        }
    };

    private onClick = (event: MouseEvent) => {
        const host = (event.target as HTMLElement).closest('limel-list-item');
        if (!host) {
            return;
        }
        const value = Number((host as HTMLElement).dataset.value);
        const text = host.getAttribute('text') || '';
        this.toggleValue(value, text);
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
        this.toggleValue(value, text);
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
