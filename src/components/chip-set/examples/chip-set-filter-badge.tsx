import { Chip } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
const CHIP_SELECET_ALL_ID = 1;

/**
 * Filter chip set with badge.
 * The badge can be used to visulize the number of results using each filter.
 */
@Component({
    tag: 'limel-example-chip-set-filter-badge',
    shadow: true,
})
export class ChipSetFilterBadgeExample {
    @State()
    private chips: Chip[] = [
        {
            id: 1,
            text: 'All',
        },
        {
            id: 2,
            text: 'Lime',
            badge: 5,
        },
        {
            id: 3,
            text: 'Apple',
            selected: true,
            badge: 0,
        },
        {
            id: 4,
            text: 'Banana',
            badge: 1,
        },
    ];

    @State()
    private disabled: boolean = false;

    constructor() {
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setAllBadgeValue();
    }

    public render() {
        return [
            <limel-chip-set
                label="Include fruits of type:"
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

    private chipSetOnChange(event: CustomEvent<Chip>) {
        const updatedChips = [...this.chips];
        if (event.detail.id !== CHIP_SELECET_ALL_ID) {
            updatedChips[0].selected = false;
        }

        if (event.detail.id === CHIP_SELECET_ALL_ID && event.detail.selected) {
            updatedChips.forEach((chip) => {
                chip.selected = false;
            });
        }

        const index = this.chips.findIndex(
            (chips) => chips.id === event.detail.id
        );
        updatedChips[index] = event.detail;
        this.chips = updatedChips;
    }

    private setDisabled(event: CustomEvent<boolean>) {
        this.disabled = event.detail;
    }

    private setAllBadgeValue() {
        let badgeValue = 0;
        this.chips.forEach((chip) => {
            if (chip.id !== CHIP_SELECET_ALL_ID) {
                badgeValue += chip.badge;
            }
        });
        this.chips[0].badge = badgeValue;
    }
}
