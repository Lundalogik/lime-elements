import {
    ListItem,
    LimelRadioButtonGroupCustomEvent,
    ListSeparator,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Basic radio button group
 *
 * :::note
 * Individual options can also be disabled while keeping others interactive.
 * :::
 */
@Component({ tag: 'limel-example-radio-button-group-basic', shadow: true })
export class RadioButtonBasicExample {
    @State()
    private selectedItem: ListItem<string>;

    @State()
    private disabled = false;

    public componentWillLoad() {
        this.selectedItem = this.items.find((item) => item.selected);
    }

    private items: Array<ListItem | ListSeparator> = [
        { text: 'First Option', value: 'option1', selected: false },
        { text: 'Second Option', value: 'option2', selected: true },
        { separator: true },
        { text: 'Third Option', value: 'option3', selected: false },
        { text: 'Disabled Option', value: 'option4', disabled: true },
    ];

    public render() {
        return [
            <limel-radio-button-group
                items={this.items}
                selectedItem={this.selectedItem}
                disabled={this.disabled}
                onChange={this.handleChange}
            />,
            <limel-example-controls>
                <limel-switch
                    value={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
            </limel-example-controls>,
            <limel-example-value
                label="Selected value"
                value={this.selectedItem?.value}
            />,
        ];
    }

    private handleChange = (
        event: LimelRadioButtonGroupCustomEvent<ListItem<string | number>>
    ) => {
        const item = event.detail;
        if (item.selected) {
            this.selectedItem = item;
        }
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };
}
