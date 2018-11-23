import { Component, State } from '@stencil/core';
import { Chip } from '../../components/chip-set/chip';

@Component({
    tag: 'limel-example-chip-set-choice',
    shadow: true,
})
export class ChipSetChoiceExample {
    @State()
    private chips: Chip[] = [
        {
            id: '1',
            text: 'Lime',
            icon: 'citrus',
        },
        {
            id: '2',
            text: 'Apple',
            selected: true,
            icon: 'apple',
        },
        {
            id: '3',
            text: 'Banana',
            icon: 'banana',
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
                type="choice"
                onChange={this.handleChange}
                value={this.chips}
            />,
        ];
    }

    private handleChange(event) {
        console.log(event.detail);
    }
}
