import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With a value as an object
 */
@Component({
    tag: 'limel-example-picker-value-as-object',
    shadow: true,
})
export class PickerValueAsObjectExample {
    @State()
    private selectedItems: Array<ListItem<{ id: string; limetype: string }>> =
        [];

    private allItems: Array<ListItem<{ id: string; limetype: string }>> = [
        {
            text: 'Erich Maria Remarque',
            secondaryText:
                'A time to love and a time to die, Spark of Life, The black obelisk, The shadows in paradise',
            value: {
                id: '1',
                limetype: 'German novelist',
            },
            icon: {
                name: 'bookmark',
                color: 'var(--lime-red)',
            },
        },
        {
            text: 'Ernest Hemingway',
            secondaryText: 'For whom the bell tolls, The sun also rises',
            value: {
                id: '2',
                limetype: 'American novelist',
            },
            icon: {
                name: 'books',
                color: 'var(--lime-magenta)',
            },
        },
        {
            text: 'Mark Twain',
            secondaryText:
                'The adventures of Tom Sawyer, The adventures of Huckleberry Finn',
            value: {
                id: '3',
                limetype: 'American writer',
            },
            icon: {
                name: 'book_shelf',
                color: 'var(--lime-blue)',
            },
        },
        {
            text: 'Gabriel García Márquez',
            secondaryText:
                'One Hundred Years of Solitude, Love in the Time of Cholera, Chronicle of a Death Foretold',
            value: {
                id: '4',
                limetype: 'Colombian novelist',
            },
            icon: {
                name: 'generic_book_file_type',
                color: 'var(--lime-orange)',
            },
        },
    ];

    public render() {
        return [
            <limel-picker
                label="Favorite authors"
                value={this.selectedItems}
                searchLabel={'Search your favorite authors'}
                multiple={true}
                searcher={this.search}
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItems} />,
        ];
    }

    private search = (query: string): Promise<ListItem[]> => {
        return new Promise((resolve) => {
            if (query === '') {
                resolve([]);
            }

            const filteredItems = this.allItems.filter((item) => {
                const searchText =
                    item.text.toLowerCase() +
                    ' ' +
                    item.secondaryText.toLowerCase();

                return searchText.includes(query.toLowerCase());
            });
            resolve(filteredItems);
        });
    };

    private onChange = (
        event: LimelPickerCustomEvent<
            Array<
                ListItem<{
                    id: string;
                    limetype: string;
                }>
            >
        >,
    ) => {
        this.selectedItems = event.detail;
    };

    private onInteract = (
        event: LimelPickerCustomEvent<
            ListItem<{ id: string; limetype: string }>
        >,
    ) => {
        console.log('Value interacted with:', event.detail);
    };
}
