import { ListItem, ListSeparator, PickerValue } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * With sectioned results
 *
 * A custom searcher can return a mix of `ListItem`s and `ListSeparator`s to
 * group results into sections. Separators can appear anywhere in the list,
 * including as the very first entry, and keyboard navigation (Tab into the
 * results, arrow keys within) still focuses the first focusable list item.
 */
@Component({
    tag: 'limel-example-picker-sections',
    shadow: true,
})
export class PickerSectionsExample {
    @State()
    private selectedItem?: ListItem<PickerValue>;

    private closeCombat: Array<ListItem<number>> = [
        { text: 'Admiral Swiggins', value: 1 },
        { text: 'Clunk', value: 3 },
        { text: 'Derpl', value: 5 },
        { text: 'Lonestar', value: 8 },
        { text: 'Skølldir', value: 11 },
    ];

    private ranged: Array<ListItem<number>> = [
        { text: 'Ayla', value: 2 },
        { text: 'Coco', value: 4 },
        { text: 'Froggy G', value: 6 },
        { text: 'Gnaw', value: 7 },
        { text: 'Leon', value: 9 },
        { text: 'Raelynn', value: 10 },
        { text: 'Voltar', value: 12 },
        { text: 'Yuri', value: 13 },
    ];

    public render() {
        return (
            <Host>
                <limel-picker
                    label="Pick an awesomenaut"
                    value={this.selectedItem}
                    searcher={this.search}
                    emptyResultMessage="No matching awesomenauts"
                    onChange={this.onChange}
                />
                <limel-example-value value={this.selectedItem} />
            </Host>
        );
    }

    private search = async (
        query: string
    ): Promise<Array<ListItem<number> | ListSeparator>> => {
        const matches = (item: ListItem<number>) =>
            item.text.toLowerCase().includes(query.toLowerCase());
        const matchedCloseCombat = this.closeCombat.filter(matches);
        const matchedRanged = this.ranged.filter(matches);

        const result: Array<ListItem<number> | ListSeparator> = [];
        if (matchedCloseCombat.length > 0) {
            result.push(
                { separator: true, text: 'Close combat' },
                ...matchedCloseCombat
            );
        }
        if (matchedRanged.length > 0) {
            result.push({ separator: true, text: 'Ranged' }, ...matchedRanged);
        }

        return result;
    };

    private onChange = (event: Event) => {
        if (!(event instanceof CustomEvent)) {
            return;
        }
        const detail: ListItem<PickerValue> | Array<ListItem<PickerValue>> =
            event.detail;
        if (!Array.isArray(detail)) {
            this.selectedItem = detail;
        }
    };
}
