import { Component, h, State } from '@stencil/core';

@Component({
    shadow: true,
    styleUrl: 'switch.scss',
    tag: 'limel-example-switch',
})
export class SwitchExample {
    @State()
    private value = true;

    @State()
    private disabled = false;

    constructor() {
        this.onClickToggleEnabled = this.onClickToggleEnabled.bind(this);
        this.onClickToggleChecked = this.onClickToggleChecked.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <section>
                <div>
                    <limel-switch
                        label={`Current value: ${this.value.toString()}`}
                        value={this.value}
                        disabled={this.disabled}
                        onChange={this.onChange}
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
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private onClickToggleEnabled() {
        this.disabled = !this.disabled;
    }

    private onClickToggleChecked() {
        this.value = !this.value;
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
