import {
    ListSeparator,
    MenuItem,
    Option,
    LimelSelectCustomEvent,
} from '@limetech/lime-elements';
import { Component, Host, State, h } from '@stencil/core';

/**
 * Size
 * When the `size` property is set to `small`, the chip will render
 * with a smaller height and gap.
 */
@Component({
    tag: 'limel-example-chip-size',
    shadow: true,
    styleUrl: 'chip-loading.scss',
})
export class ChipSizeExample {
    @State()
    private size: 'small' | 'default' = 'default';

    @State()
    private menuItems: Array<MenuItem | ListSeparator> = [
        {
            text: 'Email',
            secondaryText: 'beffie@lime.tech',
            icon: 'email_sign',
            value: 1,
        },
        {
            text: 'Direct phone',
            secondaryText: '+46 987 654 321',
            icon: 'phone',
            value: 2,
        },
        {
            text: 'Mobile',
            secondaryText: '+46 123 456 789',
            icon: 'touchscreen_smartphone',
            value: 3,
        },
    ];

    private sizeOptions: Option[] = [
        { text: 'Default', value: 'default' },
        { text: 'Small', value: 'small' },
    ];

    public render() {
        return (
            <Host>
                <limel-chip
                    text="Chip with menu"
                    removable={true}
                    menuItems={this.menuItems}
                    size={this.size}
                />
                <limel-chip
                    text="Chip with badge"
                    icon="flower"
                    badge="badge"
                    size={this.size}
                />
                <limel-chip
                    text="Removable chip"
                    removable={true}
                    icon="trash"
                    size={this.size}
                />
                <limel-example-controls>
                    <limel-select
                        label="Size"
                        value={this.getSelectedSize()}
                        options={this.sizeOptions}
                        onChange={this.handleSizeChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private getSelectedSize = (): Option => {
        return this.sizeOptions.find((option) => option.value === this.size);
    };

    private handleSizeChange = (event: LimelSelectCustomEvent<Option>) => {
        this.size = event.detail.value as 'small' | 'default';
    };
}
