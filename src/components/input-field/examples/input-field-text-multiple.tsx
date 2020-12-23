import { Component, h, State } from '@stencil/core';

/**
 * Multiple Fields
 */
@Component({
    tag: 'limel-example-input-field-text-multiple',
    shadow: true,
    styleUrl: 'input-field-text-multiple.scss',
})
export class InputFieldTextExample {
    @State()
    private firstValue: string;

    @State()
    private secondValue: string;

    @State()
    private addDistance: boolean = false;

    constructor() {
        this.firstOnChange = this.firstOnChange.bind(this);
        this.secondOnChange = this.secondOnChange.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
    }

    public render() {
        return (
            <div class={{ 'add-distance': this.addDistance }}>
                <section>
                    <limel-input-field
                        label="Fields shouldn't be too close!"
                        value={this.firstValue}
                        onChange={this.firstOnChange}
                    />
                    <limel-input-field
                        label="Type something here now to see why…"
                        helperText="See how the label covers the previous field? Now add some distance 👇"
                        value={this.secondValue}
                        onChange={this.secondOnChange}
                    />
                </section>
                <limel-flex-container justify="start">
                    <limel-checkbox
                        label="Then click this to add distance between fields"
                        onChange={this.toggleMode}
                        checked={this.addDistance}
                    />
                </limel-flex-container>
            </div>
        );
    }

    private firstOnChange(event: CustomEvent<string>) {
        this.firstValue = event.detail;
    }

    private secondOnChange(event: CustomEvent<string>) {
        this.secondValue = event.detail;
    }

    private toggleMode(event: CustomEvent<boolean>) {
        this.addDistance = event.detail;
    }
}
