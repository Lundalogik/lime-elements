import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-select',
    styleUrl: 'select.scss',
})
export class SelectExample {
    @State()
    public value: Option;

    @State()
    public disabled = false;

    private options: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han', disabled: true },
        { text: 'Leia Organo', value: 'leia' },
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }

    public render() {
        return (
            <section>
                <limel-select
                    label="Favorite hero"
                    helperText="May the force be with him or her"
                    value={this.value}
                    options={this.options}
                    disabled={this.disabled}
                    onChange={this.onChange}
                />
                <p>
                    <limel-flex-container justify="end">
                        <limel-button
                            onClick={this.toggleEnabled}
                            label={this.disabled ? 'Enable' : 'Disable'}
                        />
                    </limel-flex-container>
                </p>
                <p>Value: {JSON.stringify(this.value)}</p>
            </section>
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
