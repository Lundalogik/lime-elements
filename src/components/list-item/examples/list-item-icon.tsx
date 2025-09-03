import { Component, h, Host, State } from '@stencil/core';

/**
 * With icons
 * When `badgeIcon` is set to `true`, the icon's visual motif will be
 * rendered slightly smaller, to provide more space for a colorful background.
 * So when using a `backgroundColor` on the icon, it could be a good idea to
 * also set the `badgeIcon` property to `true`.
 */
@Component({
    tag: 'limel-example-list-item-icon',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemIconExample {
    @State()
    private badgeIcon = false;

    public render() {
        return (
            <Host>
                <ul>
                    <limel-list-item
                        value={1}
                        tabindex="0"
                        text="Santa Hat"
                        secondaryText="Santa's favorite"
                        icon={{
                            name: 'santas_hat',
                            title: 'Icon of Santa Hat',
                            color: 'rgb(var(--color-coral-default))',
                        }}
                        badgeIcon={this.badgeIcon}
                    />
                    <limel-list-item
                        value={2}
                        tabindex="0"
                        text="Party Hat"
                        secondaryText="For the party animals"
                        icon={{
                            name: 'party_hat',
                            title: 'Icon of Party Hat',
                            color: 'rgb(var(--color-white))',
                            backgroundColor: 'rgb(var(--color-pink-default))',
                        }}
                        badgeIcon={this.badgeIcon}
                    />
                </ul>
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.badgeIcon}
                        label="badgeIcon"
                        onChange={this.setBadgeIcon}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setBadgeIcon = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.badgeIcon = event.detail;
    };
}
