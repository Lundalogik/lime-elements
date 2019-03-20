import { Component, State } from '@stencil/core';
import { Option } from '../../components/select/option';

@Component({
    shadow: true,
    tag: 'limel-example-multi-select',
})
export class MultiSelectExample {
    @State()
    private basicOptions: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    @State()
    private basicValue: Option[] = [{ text: 'Han Solo', value: 'han' }];

    @State()
    private disabled = true;

    public render() {
        return [
            <section>
                <h3>Basic Usage</h3>
                <limel-flex-container justify="end">
                    <limel-button
                        label="Toggle disabled"
                        primary={true}
                        onClick={() => {
                            this.disabled = !this.disabled;
                        }}
                    />
                </limel-flex-container>
                <limel-multi-select
                    options={this.basicOptions}
                    value={this.basicValue}
                    label="Favorite heros"
                    disabled={this.disabled}
                    onChange={event => {
                        this.basicValue = event.detail;
                    }}
                />
                <p>Value: {JSON.stringify(this.basicValue)}</p>
            </section>,
        ];
    }
}
