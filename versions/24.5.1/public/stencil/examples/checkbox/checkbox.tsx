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
    private value: boolean = false;

    constructor() {
        this.changeHandler = this.changeHandler.bind(this);
        this.onClickToggleEnabled = this.onClickToggleEnabled.bind(this);
        this.onClickToggleChecked = this.onClickToggleChecked.bind(this);
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
                    <limel-flex-container justify="end">
                        <limel-button
                            onClick={this.onClickToggleEnabled}
                            label={this.disabled ? 'Enable' : 'Disable'}
                        />
                        <limel-button
                            onClick={this.onClickToggleChecked}
                            label="Toggle checked"
                        />
                    </limel-flex-container>
                </div>
                <p>
                    Value: <code>{this.value.toString()}</code>
                </p>
            </section>
        );
    }

    private onClickToggleEnabled() {
        this.disabled = !this.disabled;
    }

    private onClickToggleChecked() {
        this.value = !this.value;
    }

    private changeHandler(event) {
        this.value = event.detail;
    }
}
