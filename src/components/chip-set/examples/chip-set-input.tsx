import { Chip } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { ENTER, ENTER_KEY_CODE } from '../../../util/keycodes';

@Component({
    tag: 'limel-example-chip-set-input',
    shadow: true,
    styleUrl: 'chip-set-input.scss',
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
    private hasLeadingIcon: boolean = true;

    @State()
    private delimiter: string = '&';

    constructor() {
        this.value = [
            this.createChip('Elephant'),
            this.createChip('Caterpillar'),
            this.createChip('Badger'),
            this.createChip('Fish'),
        ];

        this.value[0].iconColor = 'var(--lime-red)';
        this.value[1].iconColor = 'var(--lime-orange)';
        this.value[2].iconColor = 'var(--lime-green)';
        this.value[3].iconColor = 'var(--lime-blue)';

        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.onInteract = this.onInteract.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setReadonly = this.setReadonly.bind(this);
        this.setRequired = this.setRequired.bind(this);
        this.setEmptyInputOnBlur = this.setEmptyInputOnBlur.bind(this);
        this.setMaxItems = this.setMaxItems.bind(this);
        this.setLeadingIcon = this.setLeadingIcon.bind(this);
        this.useDelimiters = this.useDelimiters.bind(this);
    }

    public render() {
        return [
            <limel-flex-container align="end">
                <limel-chip-set
                    label="Animal"
                    type="input"
                    value={this.value}
                    required={this.required}
                    readonly={this.readonly}
                    disabled={this.disabled}
                    leadingIcon={this.hasLeadingIcon ? 'search' : null}
                    maxItems={this.maxItems}
                    onChange={this.chipSetOnChange}
                    onInput={this.onInput}
                    onInteract={this.onInteract}
                    onKeyUp={this.onKeyUp}
                    searchLabel="Add an animal"
                    emptyInputOnBlur={this.emptyInputOnBlur}
                    delimiter={this.delimiter}
                />
                <limel-input-field
                    label="Max items"
                    value={this.maxItems.toString()}
                    type="number"
                    onChange={this.setMaxItems}
                />
            </limel-flex-container>,
            <p>
                <limel-flex-container justify="end">
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
                </limel-flex-container>
            </p>,
            <p>
                Value: <code>{JSON.stringify(this.value)}</code>
            </p>,
        ];
    }

    private onInput(event: CustomEvent<string>) {
        this.textValue = event.detail;
    }

    private onKeyUp(event: KeyboardEvent) {
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
    }

    private chipSetOnChange(event: CustomEvent<Chip[]>) {
        console.log(event.detail);
        this.value = event.detail;
    }

    private onInteract(event: CustomEvent<Chip>) {
        console.log('Chip interacted with: ', event.detail);
    }

    private createChip(name: string): Chip {
        return {
            id: name,
            text: name,
            removable: true,
            icon: `${name}`.toLowerCase(),
        };
    }

    private setDisabled(event: CustomEvent<boolean>) {
        this.disabled = event.detail;
    }

    private setReadonly(event: CustomEvent<boolean>) {
        this.readonly = event.detail;
    }

    private setRequired(event: CustomEvent<boolean>) {
        this.required = event.detail;
    }

    private setEmptyInputOnBlur(event: CustomEvent<boolean>) {
        this.emptyInputOnBlur = event.detail;
    }

    private setLeadingIcon(event: CustomEvent<boolean>) {
        this.hasLeadingIcon = event.detail;
    }

    private setMaxItems(event: CustomEvent<string>) {
        this.maxItems = +event.detail;
    }

    private useDelimiters(event: CustomEvent<boolean>) {
        this.delimiter = event.detail ? '&' : null;
    }
}
