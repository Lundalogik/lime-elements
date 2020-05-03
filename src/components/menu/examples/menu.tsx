import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const icons = ['copy', 'cut', 'paste', '', 'add', 'delete'];
const iconColors = [
    'var(--lime-green)',
    'var(--lime-red)',
    'var(--lime-orange)',
    '',
    'var(--lime-dark-blue)',
    'var(--lime-magenta)',
];

@Component({
    tag: 'limel-example-menu',
    shadow: true,
})
export class MenuExample {
    @State()
    private items: Array<ListItem | ListSeparator> = [
        { text: 'Copy' },
        { text: 'Cut' },
        { text: 'Paste', disabled: true },
        { separator: true },
        { text: 'Add that new thing' },
        { text: 'Delete that old thing' },
    ];

    @State()
    private menuOpen = false;

    public render() {
        return [
            <section>
                <h3>With default trigger</h3>
                <p>
                    <limel-menu
                        label="Menu"
                        items={this.items}
                        onSelect={this.onSelect}
                    />
                </p>
            </section>,
            <section>
                <h3>With default trigger and opening to the left</h3>
                <p>
                    <limel-menu
                        label="Menu"
                        items={this.items}
                        onSelect={this.onSelect}
                        openDirection="left"
                    />
                </p>
            </section>,
            <section>
                <h3>Disabled with default trigger</h3>
                <p>
                    <limel-menu
                        disabled={true}
                        label="Menu"
                        items={this.items}
                        onSelect={this.onSelect}
                    />
                </p>
            </section>,
            <section>
                <h3>With custom trigger</h3>
                <p>
                    <limel-menu
                        items={this.items}
                        onCancel={this.onCancel}
                        onSelect={this.onSelect}
                        open={this.menuOpen}
                    >
                        <limel-button
                            slot="trigger"
                            label="Menu"
                            primary={true}
                        />
                    </limel-menu>
                </p>
            </section>,
            <section>
                <h3>With icons</h3>
                <p>
                    <limel-menu
                        label="Menu"
                        items={this.items.map((item, index) => {
                            return { ...item, icon: icons[index] };
                        })}
                        onSelect={this.onSelect}
                    />
                </p>
            </section>,
            <section>
                <h3>With badge icons</h3>
                <p>
                    <limel-menu
                        label="Menu"
                        items={this.items.map((item, index) => {
                            return {
                                ...item,
                                icon: icons[index],
                                iconColor: iconColors[index],
                            };
                        })}
                        onSelect={this.onSelect}
                        badgeIcons={true}
                    />
                </p>
            </section>,
        ];
    }

    private onCancel = () => {
        this.menuOpen = false;
    };

    private onSelect = (event) => {
        console.log('item selected', event.detail);
        this.items = this.items.map((item) => {
            if (!('separator' in item)) {
                item.disabled = item.text === event.detail.text;
            }
            return item;
        });
    };
}
