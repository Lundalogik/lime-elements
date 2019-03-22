import { Component, State } from '@stencil/core';
import { Option } from '../../components/select/option.types';

@Component({
    shadow: true,
    tag: 'limel-example-multi-select',
    styleUrl: 'multi-select.scss',
})
export class MultiSelectExample {
    @State()
    private value: Option[] = [{ text: 'Han Solo', value: 'han' }];

    @State()
    private disabled = false;

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
        return [
            <limel-multi-select
                label="Favorite heros"
                value={this.value}
                options={this.options}
                disabled={this.disabled}
                onChange={this.onChange}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-button
                        onClick={this.toggleEnabled}
                        label={this.disabled ? 'Enable' : 'Disable'}
                    />
                </limel-flex-container>
            </p>,
            <p>Value: {JSON.stringify(this.value)}</p>,
        ];
    }

    private onChange(event) {
        this.value = event.detail;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
