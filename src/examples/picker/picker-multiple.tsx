import { ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-picker-multiple',
    shadow: true,
    styleUrl: 'picker.scss',
})
export class PickerMultipleExample {
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

    @State()
    private selectedItems: Array<ListItem<number>> = [];

    @State()
    private required: boolean = false;

    @State()
    private disabled: boolean = false;

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setRequired = this.setRequired.bind(this);
    }

    public render() {
        return [
            <limel-picker
                label="Favorite awesomenaut"
                value={this.selectedItems}
                multiple={true}
                searcher={this.search}
                onChange={this.onChange}
                onInteract={this.onInteract}
                required={this.required}
                disabled={this.disabled}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        label="Disabled"
                        onChange={this.setDisabled}
                        checked={this.disabled}
                    />
                    <limel-checkbox
                        label="Required"
                        onChange={this.setRequired}
                        checked={this.required}
                    />
                </limel-flex-container>
            </p>,
            <p>
                Value: <code>{JSON.stringify(this.selectedItems)}</code>
            </p>,
        ];
    }

    private search(query: string): Promise<ListItem[]> {
        return new Promise(resolve => {
            // Simulate some network delay
            const NETWORK_DELAY = 500;
            setTimeout(() => {
                if (query === '') {
                    const NUMBER_OF_SUGGESTIONS = 3;
                    resolve(this.allItems.slice(0, NUMBER_OF_SUGGESTIONS));
                    return;
                }

                const filteredItems = this.allItems.filter(item => {
                    return item.text
                        .toLowerCase()
                        .includes(query.toLowerCase());
                });

                resolve(filteredItems);
            }, NETWORK_DELAY);
        });
    }

    private onChange(event: CustomEvent<Array<ListItem<number>>>) {
        this.selectedItems = [...event.detail];
    }

    private onInteract(event) {
        console.log('Value interacted with:', event.detail);
    }

    private setDisabled(event: CustomEvent<boolean>) {
        this.disabled = event.detail;
    }

    private setRequired(event: CustomEvent<boolean>) {
        this.required = event.detail;
    }
}
