import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-checkbox',
    shadow: true,
    styleUrl: 'checkbox.scss',
})
export class CheckboxExample {
    @State()
    private disabled: boolean = false;

    @State()
    private required: boolean = false;

    @State()
    private value: boolean = false;

    public render() {
        return (
            <section>
                <div>
                    <limel-checkbox
                        disabled={this.disabled}
                        label="My fab checkbox"
                        id="fab"
                        checked={this.value}
                        required={this.required}
                        onChange={this.handleChange}
                    />
                </div>
                <p>
                    <limel-flex-container justify="end">
                        <limel-checkbox
                            checked={this.disabled}
                            label="Disabled"
                            onChange={this.setDisabled}
                        />
                        <limel-checkbox
                            checked={this.required}
                            label="Required"
                            onChange={this.setRequired}
                        />
                        <limel-checkbox
                            checked={this.value}
                            label="Checked"
                            onChange={this.setChecked}
                        />
                    </limel-flex-container>
                </p>
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private handleChange = (event: CustomEvent<boolean>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };

    private setChecked = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.value = !this.value;
    };
}
