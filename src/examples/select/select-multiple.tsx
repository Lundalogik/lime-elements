import { Component, State } from '@stencil/core';
import { Option } from '../../interface';

@Component({
    shadow: true,
    tag: 'limel-example-select-multiple',
    styleUrl: 'select.scss',
})
export class SelectMultipleExample {
    @State()
    public value: Option[] = [];

    @State()
    public disabled = false;

    private options: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
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
                    label="Favorite heroes"
                    value={this.value}
                    options={this.options}
                    disabled={this.disabled}
                    onChange={this.onChange}
                    multiple={true}
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

    private onChange(event: CustomEvent<Option[]>) {
        this.value = event.detail;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
