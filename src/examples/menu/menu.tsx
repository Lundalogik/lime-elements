import { Component, State } from '@stencil/core';
import { ListItem, ListSeparator } from '../../interface';

const icons = [
    'copy',
    'cut',
    'paste',
    '',
    'add',
    'delete',
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
        { text: 'Add' },
        { text: 'Delete' },
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
                        <div slot="trigger">
                            <limel-button
                                label="Menu"
                                primary={true}
                                onClick={this.onTrigger}
                            />
                        </div>
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
            <hr />,
            <p>
                When importing ListItem and ListSeparator, see{' '}
                <a href="/usage#import-statements">Usage</a>
            </p>,
        ];
    }

    private onCancel = () => {
        this.menuOpen = false;
    };
    private onTrigger = () => {
        this.menuOpen = !this.menuOpen;
    };

    private onSelect = event => {
        console.log('item selected', event.detail);
        this.items = this.items.map(item => {
            if (!('separator' in item)) {
                item.disabled = item.text === event.detail.text;
            }
            return item;
        });
    };
}
