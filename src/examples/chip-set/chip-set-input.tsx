import { Component, State } from '@stencil/core';
import { Chip } from '../../components/chip-set/chip';
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
    }

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
                label="Animal"
                type="input"
                value={this.value}
                required={true}
                disabled={this.disabled}
                onChange={this.handleChange.bind(this)}
                onInput={this.handleInput.bind(this)}
                onKeyUp={this.handleKeyUp.bind(this)}
            />,
        ];
    }

    private handleInput(event: CustomEvent<string>) {
        this.textValue = event.detail;
    }

    private handleKeyUp(event: KeyboardEvent) {
        if (event.key === ENTER || event.keyCode === ENTER_KEY_CODE) {
            this.value = [...this.value, this.createChip(this.textValue)];
            this.textValue = null;
        }
    }

    private handleChange(event: CustomEvent<Chip[]>) {
        console.log(event.detail);
        this.value = event.detail;
    }

    private createChip(name: string): Chip {
        return {
            id: name,
            text: name,
            removable: true,
            icon: `${name}`.toLowerCase(),
        };
    }
}
