import { Component, State } from '@stencil/core';

@Component({
    shadow: true,
    styleUrl: 'switch.scss',
    tag: 'limel-example-switch',
})
export class SwitchExample {
    @State()
    private valueOne = false;
    @State()
    private valueTwo = true;
    @State()
    private valueThree = false;
    @State()
    private valueFour = true;
    @State()
    private toggleExampleValue = false;

    public render() {
        return [
            <section>
                <h3>Basic usage</h3>
                <limel-switch
                    label={`${this.valueOne} - Enabled`}
                    value={this.valueOne}
                    onChange={event => {
                        this.valueOne = event.detail;
                    }}
                />
                <limel-switch
                    label={`${this.valueTwo} - Enabled`}
                    value={this.valueTwo}
                    onChange={event => {
                        this.valueTwo = event.detail;
                    }}
                />
                <limel-switch
                    label={`${this.valueThree} - Disabled`}
                    value={this.valueThree}
                    disabled={true}
                    onChange={event => {
                        this.valueThree = event.detail;
                    }}
                />
                <limel-switch
                    label={`${this.valueFour} - Disabled`}
                    value={this.valueFour}
                    disabled={true}
                    onChange={event => {
                        this.valueFour = event.detail;
                    }}
                />
            </section>,
            <section>
                <h3>Updating the value from outside the component</h3>
                <limel-button
                    label="Toggle"
                    primary={true}
                    onClick={() => {
                        this.toggleExampleValue = !this.toggleExampleValue;
                    }}
                />
                <limel-switch
                    label={`Current value: ${this.toggleExampleValue.toString()}`}
                    value={this.toggleExampleValue}
                    onChange={event => {
                        this.toggleExampleValue = event.detail;
                    }}
                />
            </section>,
        ];
    }
}
