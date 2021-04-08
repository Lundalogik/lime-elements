import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const icons = ['copy', 'cut', '', 'paste'];
const iconColors = [
    'rgb(var(--color-lime-light))',
    'rgb(var(--color-red-light))',
    '',
    'rgb(var(--color-amber-default))',
];

/**
 * Composite
 *
 * A place to try different combinations of states. This example has a slightly
 * more advanced `onSelect` handler, which disables the last selected value.
 */
@Component({
    tag: 'limel-example-menu-composite',
    shadow: true,
})
export class MenuCompositeExample {
    @State()
    private disabled = false;

    @State()
    private openLeft = false;

    @State()
    private showIcons = false;

    @State()
    private badgeIcons = false;

    @State()
    private showColors = false;

    @State()
    private items: Array<ListItem | ListSeparator> = [
        { text: 'Copy' },
        { text: 'Cut' },
        { separator: true },
        { text: 'Paste', disabled: true },
    ];

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    constructor() {
        this.handleSelect = this.handleSelect.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDisabled = this.handleDisabled.bind(this);
        this.handleOpenLeft = this.handleOpenLeft.bind(this);
        this.handleShowIcons = this.handleShowIcons.bind(this);
        this.handleBadgeIcons = this.handleBadgeIcons.bind(this);
        this.handleShowColors = this.handleShowColors.bind(this);
    }

    public render() {
        return [
            <limel-menu
                items={this.items}
                disabled={this.disabled}
                openDirection={this.openLeft ? 'left' : 'right'}
                badgeIcons={this.badgeIcons}
                onSelect={this.handleSelect}
                onCancel={this.handleCancel}
            >
                <limel-button
                    label="Menu"
                    disabled={this.disabled}
                    slot="trigger"
                />
            </limel-menu>,
            <limel-example-controls>
                <limel-switch
                    label="Disabled"
                    value={this.disabled}
                    onChange={this.handleDisabled}
                />
                <limel-switch
                    label="Open left"
                    value={this.openLeft}
                    onChange={this.handleOpenLeft}
                />
                <limel-switch
                    label="Icons"
                    value={this.showIcons}
                    onChange={this.handleShowIcons}
                />
                <limel-switch
                    label="Badge icons"
                    value={this.badgeIcons}
                    onChange={this.handleBadgeIcons}
                />
                <limel-switch
                    label="Colors"
                    value={this.showColors}
                    onChange={this.handleShowColors}
                />
            </limel-example-controls>,
            <limel-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private handleSelect(event: CustomEvent) {
        this.eventPrinter.writeEvent(event);
        this.items = this.items.map((item) => {
            if (!('separator' in item)) {
                item.disabled = item.text === event.detail.text;
            }

            return item;
        });
    }

    private handleCancel(event: Event) {
        this.eventPrinter.writeEvent(event);
    }

    private handleDisabled(event: CustomEvent<boolean>) {
        this.disabled = event.detail;
    }

    private handleOpenLeft(event: CustomEvent<boolean>) {
        this.openLeft = event.detail;
    }

    private handleShowIcons(event: CustomEvent<boolean>) {
        this.showIcons = event.detail;
        if (this.showIcons) {
            this.items = this.items.map((item, index) => {
                return { ...item, icon: icons[index] };
            });
        } else {
            this.items = this.items.map((item) => {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                delete item['icon'];

                return item;
            });
        }
    }

    private handleBadgeIcons(event: CustomEvent<boolean>) {
        this.badgeIcons = event.detail;
    }

    private handleShowColors(event: CustomEvent<boolean>) {
        this.showColors = event.detail;
        if (this.showColors) {
            this.items = this.items.map((item, index) => {
                return { ...item, iconColor: iconColors[index] };
            });
        } else {
            this.items = this.items.map((item) => {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                delete item['iconColor'];

                return item;
            });
        }
    }
}
