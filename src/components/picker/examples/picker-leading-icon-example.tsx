import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With a "search" leading icon
 */
@Component({
    tag: 'limel-example-picker-leading-icon',
    shadow: true,
})
export class PickerLeadingIconExample {
    @State()
    private selectedItem: ListItem<number>;

    private allItems: Array<ListItem<number>> = [
        { text: 'Admiral Swiggins', value: 1 },
        { text: 'Ayla', value: 2 },
        { text: 'Clunk', value: 3 },
        { text: 'Coco', value: 4 },
        { text: 'Derpl', value: 5 },
        { text: 'Froggy G', value: 6 },
        { text: 'Gnaw', value: 7 },
        { text: 'Lonestar', value: 8 },
        { text: 'Leon', value: 9 },
        { text: 'Raelynn', value: 10 },
        { text: 'Skølldir', value: 11 },
        { text: 'Voltar', value: 12 },
        { text: 'Yuri', value: 13 },
    ];

    public render() {
        return [
            <limel-picker
                label="Favorite awesomenaut"
                leadingIcon="search"
                value={this.selectedItem}
                allItems={this.allItems}
                emptyResultMessage="No results"
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <p>
                Value: <code>{JSON.stringify(this.selectedItem)}</code>
            </p>,
        ];
    }

    private onChange = (event: LimelPickerCustomEvent<ListItem<number>>) => {
        this.selectedItem = event.detail;
    };

    private onInteract = (event: LimelPickerCustomEvent<ListItem<number>>) => {
        console.log('Value interacted with:', event.detail);
    };
}
