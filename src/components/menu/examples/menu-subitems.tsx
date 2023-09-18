import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';

/**
 * With Sub items
 */
@Component({
    tag: 'limel-example-menu-subitems',
    shadow: true,
})
export class MenuSubItemsExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'Format',
            items: [
                {
                    text: 'Bold',
                    icon: 'bold',
                },
                {
                    text: 'Italic',
                    icon: 'italic',
                },
                {
                    text: 'Lists',
                    icon: 'bulleted_list',
                    items: [
                        {
                            text: 'Numbered list',
                            icon: 'numbered_list',
                        },
                        {
                            text: 'Bullet list',
                            icon: 'bulleted_list',
                        },
                        {
                            text: 'Checklist',
                            icon: 'todo_list',
                        },
                    ],
                },
            ],
        },
        {
            text: 'Edit',
            items: [
                {
                    text: 'Copy',
                    icon: 'copy',
                },
                {
                    text: 'Cut',
                    icon: 'cut',
                },
                { separator: true },
                {
                    text: 'Paste',
                    icon: 'paste',
                },
            ],
        },
    ];

    @State()
    private lastSelectedItem: string;

    public render() {
        return [
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>,
            <limel-example-value
                label="Last selected item"
                value={this.lastSelectedItem}
            />,
        ];
    }

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail.text;
    };
}
