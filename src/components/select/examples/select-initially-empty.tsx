import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Initially Empty
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-initially-empty',
})
export class SelectExample {
    @State()
    public value: Option;

    private options: Option[] = [
        { text: '', value: '' },
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    public render() {
        return (
            <section>
                <limel-select
                    label="Favorite hero"
                    value={this.value}
                    options={this.options}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };
}
