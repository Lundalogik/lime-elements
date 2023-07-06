import { Chip, LimelChipSetCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { ENTER, ENTER_KEY_CODE } from '../../../util/keycodes';

/**
 * Input chip set with `inputType` of `search`
 *
 * When autocorrection is potentially harmful for the user experience and for
 * your intended result, use `search` as `inputType`. For instance, for a
 * question like "Please suggest unique names for our newly founded company",
 * you probably don't want autocorrection, because you would expect many
 * valid suggestions to not exist in the autocorrection dictionary. Therefore,
 * you do not want the respondent's input to be regarded as a typo and to be
 * changed when they press <kbd>Enter</kbd> or <kbd>Space</kbd>.
 */
@Component({
    tag: 'limel-example-chip-set-input-type-search',
    shadow: true,
})
export class ChipSetInputExample {
    @State()
    private value: Chip[];

    @State()
    private textValue = '';

    @State()
    private maxItems = 3;

    @State()
    private emptyInputOnBlur: boolean = true;

    constructor() {
        this.value = [this.createChip('Lundalogik'), this.createChip('Lime')];
    }

    public render() {
        return [
            <limel-chip-set
                type="input"
                inputType="search"
                label="Suggest three unique names for our newly founded company"
                maxItems={this.maxItems}
                value={this.value}
                onChange={this.handleChange}
                onInput={this.handleInput}
                onKeyUp={this.onKeyUp}
                emptyInputOnBlur={this.emptyInputOnBlur}
            />,
        ];
    }

    private handleInput = (
        event: LimelChipSetCustomEvent<string> | InputEvent
    ) => {
        if (event instanceof CustomEvent) {
            this.textValue = event.detail;
        }
    };

    private onKeyUp = (event: KeyboardEvent) => {
        if (
            (event.key === ENTER || event.keyCode === ENTER_KEY_CODE) &&
            this.textValue.trim()
        ) {
            this.value = [
                ...this.value,
                this.createChip(this.textValue.trim()),
            ];
            this.textValue = '';
        }
    };

    private handleChange = (event: LimelChipSetCustomEvent<Chip[]>) => {
        this.value = event.detail;
    };

    private createChip = (name: string): Chip => {
        return {
            id: name,
            text: name,
            removable: true,
        };
    };
}
