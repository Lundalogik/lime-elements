import { Chip } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { ENTER, ENTER_KEY_CODE } from '../../util/keycodes';

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
    private disabled: boolean = false;

    @State()
    private emptyInputOnBlur: boolean = true;

    constructor() {
        this.value = [
            this.createChip('Elephant'),
            this.createChip('Caterpillar'),
            this.createChip('Badger'),
            this.createChip('Fish'),
        ];

        this.value[0].iconColor = 'var(--lime-red)'; // tslint:disable-line:no-magic-numbers
        this.value[1].iconColor = 'var(--lime-orange)'; // tslint:disable-line:no-magic-numbers
        this.value[2].iconColor = 'var(--lime-green)'; // tslint:disable-line:no-magic-numbers
        this.value[3].iconColor = 'var(--lime-blue)'; // tslint:disable-line:no-magic-numbers

        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.onInteract = this.onInteract.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.setEnabled = this.setEnabled.bind(this);
        this.setRequired = this.setRequired.bind(this);
        this.setEmptyInputOnBlur = this.setEmptyInputOnBlur.bind(this);
    }

    public render() {
        return [
            <limel-chip-set
                label="Animal"
                type="input"
                value={this.value}
                required={this.required}
                disabled={this.disabled}
                onChange={this.chipSetOnChange}
                onInput={this.onInput}
                onInteract={this.onInteract}
                onKeyUp={this.onKeyUp}
                searchLabel="Add an animal"
                emptyInputOnBlur={this.emptyInputOnBlur}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        label="Empty input on blur"
                        onChange={this.setEmptyInputOnBlur}
                        checked={this.emptyInputOnBlur}
                    />
                    <limel-checkbox
                        label="Disabled"
                        onChange={this.setEnabled}
                        checked={this.disabled}
                    />
                    <limel-checkbox
                        label="Required"
                        onChange={this.setRequired}
                        checked={this.required}
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

    private setEnabled(event: CustomEvent<boolean>) {
        this.disabled = event.detail;
    }

    private setRequired(event: CustomEvent<boolean>) {
        this.required = event.detail;
    }

    private setEmptyInputOnBlur(event: CustomEvent<boolean>) {
        this.emptyInputOnBlur = event.detail;
    }
}
