import { Component, State } from '@stencil/core';
import { Chip } from '../../components/chip-set/chip';

@Component({
    tag: 'limel-example-chip-set-filter',
    shadow: true,
})
export class ChipSetFilterExample {
    @State()
    private chips: Chip[] = [
        {
            id: '1',
            text: 'Lime',
        },
        {
            id: '2',
            text: 'Apple',
            selected: true,
        },
        {
            id: '3',
            text: 'Banana',
        },
    ];

    @State()
    private disabled: boolean = false;

    public render() {
        return [
            <limel-switch
                label="Disabled"
                onChange={event => {
                    return (this.disabled = event.detail);
                }}
            />,
            <br />,
            <br />,
            <limel-chip-set
                disabled={this.disabled}
                type="filter"
                onChange={this.handleChange}
                value={this.chips}
            />,
        ];
    }

    private handleChange(event) {
        console.log(event.detail);
    }
}
