import { Chip, LimelChipSetCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { ENTER } from '../../../util/keycodes';

/**
 * Input chip set
 *
 * Useful for collections of tags or labels. Can also be used as an advanced
 * search input, with leading icon and a delimiter between search terms.
 *
 * :::note
 * Setting `readonly` to `true` when the `type="input"`, the chips that are displayed
 * will remain interactive. This means that the user can still click on them.
 * However, the chips cannot be removed or added in `readonly` mode.
 * :::
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
    private invalid: boolean = false;

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
                invalid={this.invalid}
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
            <limel-example-controls>
                <limel-input-field
                    label="Max items"
                    value={this.maxItems.toString()}
                    type="number"
                    onChange={this.setMaxItems}
                />
                <limel-switch
                    label="Empty input on blur"
                    onChange={this.setEmptyInputOnBlur}
                    value={this.emptyInputOnBlur}
                />
                <limel-switch
                    label="Disabled"
                    onChange={this.setDisabled}
                    value={this.disabled}
                />
                <limel-switch
                    label="Readonly"
                    onChange={this.setReadonly}
                    value={this.readonly}
                />
                <limel-switch
                    label="Required"
                    onChange={this.setRequired}
                    value={this.required}
                />
                <limel-switch
                    label="Invalid"
                    onChange={this.setInvalid}
                    value={this.invalid}
                />
                <limel-switch
                    label={'Leading icon'}
                    onChange={this.setLeadingIcon}
                    value={this.hasLeadingIcon}
                />
                <limel-switch
                    label="Use delimiters"
                    onChange={this.useDelimiters}
                    value={this.delimiter !== null}
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
        if (event.key === ENTER && this.textValue.trim()) {
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
        console.log('Chip interacted with:', event.detail);
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

    private setInvalid = (event: CustomEvent<boolean>) => {
        this.invalid = event.detail;
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
