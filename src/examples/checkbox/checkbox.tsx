import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-checkbox',
    shadow: true,
    styleUrl: 'checkbox.scss',
})
export class CheckboxExample {
    @State()
    private disabled: boolean = false;

    @State()
    private value: boolean = false;

    constructor() {
        this.changeHandler = this.changeHandler.bind(this);
    }

    public render() {
        return (
            <section>
                <div>
                    <limel-checkbox
                        disabled={this.disabled}
                        label="My fab checkbox"
                        id="fab"
                        checked={this.value}
                        onChange={this.changeHandler}
                    />
                    <limel-button-group>
                        <limel-button
                            onClick={() => {
                                this.disabled = !this.disabled;
                            }}
                            label={this.disabled ? 'Enable' : 'Disable'}
                        />
                        <limel-button
                            onClick={() => {
                                this.value = !this.value;
                            }}
                            label="Toggle checked"
                        />
                    </limel-button-group>
                </div>
                <p>
                    Value: <code>{this.value.toString()}</code>
                </p>
            </section>
        );
    }

    private changeHandler(event) {
        this.value = event.detail;
    }
}
