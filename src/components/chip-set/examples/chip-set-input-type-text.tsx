import { Chip, LimelChipSetCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { ENTER, ENTER_KEY_CODE } from '../../../util/keycodes';

/**
 * Input chip set with `inputType` of `text`
 *
 * There is a slight difference in the way browsers treat `input` field
 * with `type="text"` and `type="search"`. You can read more about this
 * difference in [Mozilla's documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search#using_search_inputs),
 * but the most important difference in this case is activation of the
 * autocorrection feature on most smart devices.
 *
 * When a user makes a spelling mistake while typing in an input field with
 * `type="text"`, the mistake will be corrected automatically, right after they
 * press <kbd>Enter</kbd> or <kbd>Space</kbd>. Input fields with `type="search"`
 * do not auto correct the user's input.
 *
 * If you want to use limel-chip-set in a form context, where autocorrection is
 * a good thing, use `text` as `inputType`. It is important to know that the
 * chip-set component creates a chip from the autocorrected value, after the
 * user has pressed the <kbd>Enter</kbd> key and the auto correction has fixed
 * existing typos! For example, for a question like "Please type five of your
 * favorite fruits", you would want to avoid misspellings, to collect higher
 * quality data.
 */
@Component({
    tag: 'limel-example-chip-set-input-type-text',
    shadow: true,
})
export class ChipSetInputExample {
    @State()
    private value: Chip[];

    @State()
    private textValue = '';

    @State()
    private maxItems = 5;

    @State()
    private emptyInputOnBlur: boolean = true;

    constructor() {
        this.value = [
            this.createChip('Apple'),
            this.createChip('Pear'),
            this.createChip('Strawberry'),
            this.createChip('Banana'),
        ];
    }

    public render() {
        return [
            <limel-chip-set
                type="input"
                inputType="text"
                label="Type five of your favorite fruits."
                helperText="For some fruit names, icons are displayed on the chips"
                value={this.value}
                maxItems={this.maxItems}
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
            icon: `${name}`.toLowerCase(),
        };
    };
}
