import { Component, State } from '@stencil/core';
import { Option } from '../../components/select/option';

@Component({
    shadow: true,
    tag: 'limel-example-multi-select-show-options',
})
export class MultiSelectShowOptionsExample {
    @State()
    private basicOptions: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    @State()
    private basicValue: Option[] = [{ text: 'Han Solo', value: 'han' }];

    public render() {
        return [
            <section>
                <h3>Show options without summary and trigger</h3>
                <limel-multi-select
                    alwaysShowOptions={true}
                    options={this.basicOptions}
                    value={this.basicValue}
                    label="Favorite heros"
                    onChange={event => {
                        this.basicValue = event.detail;
                    }}
                />
                <p>Value: {JSON.stringify(this.basicValue)}</p>
            </section>,
        ];
    }
}
