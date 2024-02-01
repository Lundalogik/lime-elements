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
        { text: 'Yes', value: 1, selected: false },
        { text: 'No', value: 2, selected: false },
    ];

    @State()
    private items2: Array<ListItem | ListSeparator> = [
        { text: 'Public', value: 1, selected: false },
        { text: 'Only myself', value: 2, selected: false },
    ];

    @State()
    private selectedItem1: ListItem | ListSeparator;
    private selectedItem2: ListItem | ListSeparator;

    constructor() {
        this.selectedItem1 = this.items1.filter((item: ListItem) => {
            return !!item.selected;
        })[0];
        this.selectedItem2 = this.items2.filter((item: ListItem) => {
            return !!item.selected;
        })[0];
    }

    public render() {
        return (
            <div class="do-dont-container">
                <div class="do">
                    <limel-header
                        heading="Example of boolean questions in a form"
                        subheading="using radio buttons"
                    />
                    <div class="container">
                        <p> ···</p>
                        <p>
                            Do you want to receive our news and updates via
                            email?
                        </p>
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
                </div>
            </div>
        );
    }

    private handleChange1 = (event: LimelListCustomEvent<ListItem>) => {
        this.selectedItem1 = event.detail;
        this.items1 = this.items1.map((item: ListItem) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }

            return item;
        });
    };

    private handleChange2 = (event: LimelListCustomEvent<ListItem>) => {
        this.selectedItem2 = event.detail;
        this.items2 = this.items2.map((item: ListItem) => {
            if (item.value === event.detail.value) {
                return event.detail;
            }

            return item;
        });
    };
}
