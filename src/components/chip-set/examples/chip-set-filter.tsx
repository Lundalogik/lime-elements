import { Chip } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-chip-set-filter',
    shadow: true,
})
export class ChipSetFilterExample {
    @State()
    private chips: Chip[] = [
        {
            id: 1,
            text: 'Lime',
        },
        {
            id: 2,
            text: 'Apple',
            selected: true,
        },
        {
            id: 3,
            text: 'Banana',
        },
    ];

    @State()
    private disabled: boolean = false;

    constructor() {
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
    }

    public render() {
        return [
            <limel-chip-set
                disabled={this.disabled}
                type="filter"
                onChange={this.chipSetOnChange}
                value={this.chips}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        label="Disabled"
                        onChange={this.setDisabled}
                        checked={this.disabled}
                    />
                </limel-flex-container>
            </p>,
        ];
    }

    private chipSetOnChange(event) {
        console.log(event.detail);
    }

    private setDisabled(event: CustomEvent<boolean>) {
        this.disabled = event.detail;
    }
}
