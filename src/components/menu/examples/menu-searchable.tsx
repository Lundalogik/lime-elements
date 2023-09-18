import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';
import { SearchMenuItems } from './subitems-search';

/**
 * Searchable items
 * @link subitems-search.ts
 */
@Component({
    tag: 'limel-example-menu-searchable',
    shadow: true,
})
export class MenuSubItemsExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'Format',
            subItems: [
                {
                    text: 'Bold',
                    icon: 'bold',
                },
                {
                    text: 'Italic',
                    icon: 'italic',
                },
                {
                    text: 'Bullets and numbering',
                    icon: 'bulleted_list',
                    subItems: [
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
            subItems: [
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
        {
            text: 'Long sub list',
            subItems: Array.from(Array(50), (_value, index) => {
                return {
                    text: `Item ${index + 1}`,
                };
            }),
        },
    ];

    @State()
    private lastSelectedItem: MenuItem;

    public render() {
        return [
            <limel-menu
                items={this.items}
                searcher={this.handleSearch}
                onSelect={this.handleSelect}
            >
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>,
            <limel-example-value
                label="Last selected item"
                value={this.lastSelectedItem?.text ?? ''}
            />,
        ];
    }

    private handleSearch = async (queryString: string) => {
        return SearchMenuItems(queryString, this.items);
    };

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        this.lastSelectedItem = event.detail;
    };
}
