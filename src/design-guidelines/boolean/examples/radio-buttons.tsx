import { Component, State, h } from '@stencil/core';
import {
    LimelListCustomEvent,
    ListItem,
    ListSeparator,
} from '@limetech/lime-elements';

@Component({
    tag: 'limel-example-boolean-radio-buttons',
    shadow: true,
    styleUrl: 'switch-vs-checkbox.scss',
})
export class BooleanRadioButtonsExample {
    @State()
    private items1: Array<ListItem | ListSeparator> = [
        { text: 'Yes', value: 1, selected: true },
        { text: 'No', value: 2, selected: false },
    ];

    @State()
    private items2: Array<ListItem | ListSeparator> = [
        { text: 'Public', value: 1, selected: false },
        { text: 'Only myself', value: 2, selected: true },
    ];

    public render() {
        return (
            <div class="container" style={{ pointerEvents: 'none' }}>
                <p> ···</p>
                <p>Do you want to receive our news and updates via email?</p>
                <limel-list
                    type="radio"
                    items={this.items1}
                    onChange={this.handleChange1}
                />
                <p>Who can see your profile?</p>
                <limel-list
                    type="radio"
                    items={this.items2}
                    onChange={this.handleChange2}
                />
            </div>
        );
    }

    private handleChange1 = (event: LimelListCustomEvent<ListItem>) => {
        this.items1 = this.items1.map((item: ListItem) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }

            return item;
        });
    };

    private handleChange2 = (event: LimelListCustomEvent<ListItem>) => {
        this.items2 = this.items2.map((item: ListItem) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }

            return item;
        });
    };
}
