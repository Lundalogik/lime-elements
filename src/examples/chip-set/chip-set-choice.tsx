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
        this.disabledOnChange = this.disabledOnChange.bind(this);
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
    }

    public render() {
        return [
            <limel-switch label="Disabled" onChange={this.disabledOnChange} />,
            <br />,
            <br />,
            <limel-chip-set
                disabled={this.disabled}
                type="choice"
                onChange={this.chipSetOnChange}
                value={this.chips}
            />,
        ];
    }

    private disabledOnChange(event) {
        this.disabled = event.detail;
    }

    private chipSetOnChange(event) {
        console.log(event.detail);
    }
}
