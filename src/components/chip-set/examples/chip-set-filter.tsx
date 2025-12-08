import { Chip } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Filter chip set
 *
 * Any number of options can be selected at once, including none. As the name
 * suggests, this one is good for filtering things.
 */
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

    public render() {
        return [
            <limel-chip-set
                label="Include fruits of type:"
                disabled={this.disabled}
                type="filter"
                onChange={this.handleChange}
                value={this.chips}
            />,
            <limel-example-controls>
                <limel-switch
                    label="Disabled"
                    onChange={this.setDisabled}
                    value={this.disabled}
                />
            </limel-example-controls>,
        ];
    }

    private handleChange = (event) => {
        console.log(event.detail);
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };
}
