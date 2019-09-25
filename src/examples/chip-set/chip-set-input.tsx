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
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
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
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        label="Disabled"
                        onChange={this.toggleEnabled}
                        checked={this.disabled}
                    />
                    <limel-checkbox
                        label="Required"
                        onChange={this.toggleRequired}
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
        if (event.key === ENTER || event.keyCode === ENTER_KEY_CODE) {
            this.value = [...this.value, this.createChip(this.textValue)];
            this.textValue = null;
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

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
