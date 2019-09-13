import { Chip } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-chip-set-choice',
    shadow: true,
})
export class ChipSetChoiceExample {
    @State()
    private chips: Chip[] = [
        {
            id: 1,
            text: 'Lime',
            icon: 'citrus',
        },
        {
            id: 2,
            text: 'Apple',
            selected: true,
            icon: 'apple',
        },
        {
            id: 3,
            text: 'Banana',
            icon: 'banana',
        },
    ];

    @State()
    private disabled: boolean = false;

    constructor() {
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }

    public render() {
        return [
            <limel-chip-set
                disabled={this.disabled}
                type="choice"
                onChange={this.chipSetOnChange}
                value={this.chips}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        label="Disabled"
                        onChange={this.toggleEnabled}
                        checked={this.disabled}
                    />
                </limel-flex-container>
            </p>,
        ];
    }

    private chipSetOnChange(event) {
        console.log(event.detail);
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
