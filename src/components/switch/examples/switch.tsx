import { Component, h, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-switch',
})
export class SwitchExample {
    @State()
    private value = true;

    @State()
    private disabled = false;

    public render() {
        return (
            <section>
                <div>
                    <limel-switch
                        label={`Current value: ${this.value.toString()}`}
                        value={this.value}
                        disabled={this.disabled}
                        onChange={this.changeHandler}
                    />
                    <limel-flex-container justify="end">
                        <limel-checkbox
                            checked={this.disabled}
                            label="Disabled"
                            onChange={this.setDisabled}
                        />
                        <limel-checkbox
                            checked={this.value}
                            label="Toggle checked"
                            onChange={this.setChecked}
                        />
                    </limel-flex-container>
                </div>
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private changeHandler = (event: CustomEvent<boolean>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setChecked = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.value = event.detail;
    };
}
