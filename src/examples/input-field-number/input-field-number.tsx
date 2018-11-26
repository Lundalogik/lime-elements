import { Component, Prop, State, Watch } from '@stencil/core';

@Component({
    tag: 'limel-example-input-field-number',
    shadow: true,
})
export class InputFieldNumberExample {
    @Prop({ mutable: true })
    public required: boolean = false;

    @State()
    public disabled: boolean = false;
    @State()
    public invalid: boolean = false;
    @State()
    public value: any;
    @State()
    public formatNumber: boolean = true;

    public render() {
        return [
            <section>
                <limel-button-group>
                    <limel-button
                        onClick={() => {
                            this.formatNumber = !this.formatNumber;
                        }}
                        label={
                            this.formatNumber
                                ? 'Unformat number'
                                : 'Format number'
                        }
                    />
                </limel-button-group>
                <limel-button-group>
                    <limel-button
                        onClick={() => {
                            this.disabled = !this.disabled;
                        }}
                        label={this.disabled ? 'Enable' : 'Disable'}
                    />
                    <limel-button
                        onClick={() => {
                            this.required = !this.required;
                        }}
                        label={this.required ? 'Set optional' : 'Set required'}
                    />
                </limel-button-group>
                <limel-input-field
                    label="Number Field Label"
                    value={this.value}
                    onChange={event => {
                        this.changeHandler(event);
                    }}
                    type="number"
                    formatNumber={this.formatNumber}
                    disabled={this.disabled}
                    invalid={this.invalid}
                    required={this.required}
                />
                <span>Value: {this.value}</span>
            </section>,
        ];
    }

    /*
     * `public`, `protected`, and `private` are just compiler hints
     * in TypeScript, and doesn't actually affect the compiled code
     * in any way. We can take advantage of this, because while
     * watchers are being called from outside the component by the
     * "framework" code, they should never be called by any outside
     * code we write ourselves. The `protected`-label ensures we
     * would get a compiler-error if we tried to call the function
     * from outside the component, while also *not* giving a compiler
     * error because the function isn't used internally (like `private`
     * would have done).
     */
    @Watch('required')
    protected watchRequired() {
        console.log('watch required');
        this.invalid = this.required && !this.value;
    }

    private changeHandler(event) {
        console.log('listen on value');
        this.value = event.detail;
        this.invalid = this.required && !this.value;
    }
}
