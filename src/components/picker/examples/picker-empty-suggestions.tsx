import { ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const NETWORK_DELAY = 500;

@Component({
    tag: 'limel-example-picker-empty-suggestions',
    shadow: true,
})
export class PickerExample {
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
    private selectedItem: ListItem<number>;

    @State()
    private required: boolean = false;

    @State()
    private readonly: boolean = false;

    @State()
    private disabled: boolean = false;

    constructor() {
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setReadonly = this.setReadonly.bind(this);
        this.setRequired = this.setRequired.bind(this);
    }

    public render() {
        return [
            <limel-picker
                label="Favorite awesomenaut"
                value={this.selectedItem}
                searcher={this.search}
                emptyResultMessage="No results"
                onChange={this.onChange}
                onInteract={this.onInteract}
                required={this.required}
                readonly={this.readonly}
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
                        label="Readonly"
                        onChange={this.setReadonly}
                        checked={this.readonly}
                    />
                    <limel-checkbox
                        label="Required"
                        onChange={this.setRequired}
                        checked={this.required}
                    />
                </limel-flex-container>
            </p>,
            <limel-example-value value={this.selectedItem} />,
        ];
    }

    private search(query: string): Promise<ListItem[]> {
        return new Promise((resolve) => {
            if (query === '') {
                // Simulate some network delay
                setTimeout(() => {
                    resolve([]);
                }, NETWORK_DELAY);
            }

            // Simulate some network delay
            setTimeout(() => {
                const filteredItems = this.allItems.filter((item) => {
                    return item.text
                        .toLowerCase()
                        .includes(query.toLowerCase());
                });
                resolve(filteredItems);
            }, NETWORK_DELAY);
        });
    }

    private onChange(event: CustomEvent<ListItem<number>>) {
        this.selectedItem = event.detail;
    }

    private onInteract(event) {
        console.log('Value interacted with:', event.detail);
    }

    private setDisabled(event: CustomEvent<boolean>) {
        this.disabled = event.detail;
    }

    private setReadonly(event: CustomEvent<boolean>) {
        this.readonly = event.detail;
    }

    private setRequired(event: CustomEvent<boolean>) {
        this.required = event.detail;
    }
}
