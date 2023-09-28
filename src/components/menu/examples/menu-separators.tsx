import {
    MenuItem,
    ListSeparator,
    LimelMenuCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Using separators with titles
 *
 * You divide groups of items using separators.
 * It is also possible add a short title to the separators,
 * to clarify further what each group of menu items is about,
 * and by doing so improve the users perception and experience.
 */
@Component({
    tag: 'limel-example-menu-separators',
    shadow: true,
})
export class MenuSeparatorExample {
    @State()
    private lastSelectedItem: string;

    private items: Array<MenuItem | ListSeparator> = [
        { text: 'Home' },
        { text: 'Back' },
        { text: 'Forward' },
        { separator: true, text: 'Recently closed' },
        { text: 'Lime CRM' },
        { text: 'Lime Go' },
        { separator: true, text: 'Recently visited' },
        { text: 'Lime Elements' },
        { text: 'Github' },
        { text: 'DuckDuckGo' },
        { separator: true },
        { text: 'Show full history' },
    ];

    public render() {
        return [
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-button label="Browsing History" slot="trigger" />
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
