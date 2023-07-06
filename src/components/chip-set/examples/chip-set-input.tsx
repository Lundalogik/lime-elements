import { Chip, LimelChipSetCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { ENTER, ENTER_KEY_CODE } from '../../../util/keycodes';

/**
 * Input chip set
 *
 * Useful for collections of tags or labels. Can also be used as an advanced
 * search input, with leading icon and a delimiter between search terms.
 */
@Component({
    tag: 'limel-example-chip-set-input',
    shadow: true,
})
export class ChipSetInputExample {
    @State()
    private value: Chip[];

    @State()
    private textValue = '';

    @State()
    private required: boolean = false;

    @State()
    private readonly: boolean = false;

    @State()
    private disabled: boolean = false;

    @State()
    private maxItems = 0;

    @State()
    private emptyInputOnBlur: boolean = true;

    @State()
    private hasLeadingIcon: boolean = false;

    @State()
    private delimiter: string = null;

    constructor() {
        this.value = [
            this.createChip('Elephant'),
            this.createChip('Caterpillar'),
            this.createChip('Badger'),
            this.createChip('Fish'),
        ];
    }

    public render() {
        return [
            <limel-chip-set
                type="input"
                label="Animal"
                helperText="For some animal names, icons are displayed on the chips"
                searchLabel="Type an animal name & press Enter"
                value={this.value}
                required={this.required}
                readonly={this.readonly}
                disabled={this.disabled}
                leadingIcon={this.hasLeadingIcon ? 'search' : null}
                maxItems={this.maxItems}
                onChange={this.handleChange}
                onInput={this.handleInput}
                onInteract={this.handleInteraction}
                onKeyUp={this.onKeyUp}
                emptyInputOnBlur={this.emptyInputOnBlur}
                delimiter={this.delimiter}
            />,
            <limel-example-controls
                style={{ '--example-controls-max-columns-width': '9rem' }}
            >
                <limel-input-field
                    label="Max items"
                    value={this.maxItems.toString()}
                    type="number"
                    onChange={this.setMaxItems}
                />
                <limel-checkbox
                    label="Empty input on blur"
                    onChange={this.setEmptyInputOnBlur}
                    checked={this.emptyInputOnBlur}
                />
                <limel-checkbox
                    label="Disabled"
                    onChange={this.setDisabled}
                    checked={this.disabled}
                />
                <limel-checkbox
                    label="Readonly"
                    onChange={this.setReadonly}
                    checked={this.readonly}
                />
                <limel-checkbox
                    label="Required"
                    onChange={this.setRequired}
                    checked={this.required}
                />
                <limel-checkbox
                    label={'Leading icon'}
                    onChange={this.setLeadingIcon}
                    checked={this.hasLeadingIcon}
                />
                <limel-checkbox
                    label="Use delimiters"
                    onChange={this.useDelimiters}
                    checked={this.delimiter !== null}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
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
        console.log(event.detail);
        this.value = event.detail;
    };

    private handleInteraction = (event: CustomEvent<Chip>) => {
        console.log('Chip interacted with: ', event.detail);
    };

    private createChip = (name: string): Chip => {
        return {
            id: name,
            text: name,
            removable: true,
            icon: `${name}`.toLowerCase(),
        };
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        this.readonly = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        this.required = event.detail;
    };

    private setEmptyInputOnBlur = (event: CustomEvent<boolean>) => {
        this.emptyInputOnBlur = event.detail;
    };

    private setLeadingIcon = (event: CustomEvent<boolean>) => {
        this.hasLeadingIcon = event.detail;
    };

    private setMaxItems = (event: CustomEvent<string>) => {
        this.maxItems = +event.detail;
    };

    private useDelimiters = (event: CustomEvent<boolean>) => {
        this.delimiter = event.detail ? '&' : null;
    };
}
