import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Specific Value Preselected
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-preselected',
})
export class SelectExample {
    @State()
    public value: Option = { text: 'Leia Organo', value: 'leia' };

    private options: Option[] = [
        { text: '', value: '' },
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <section>
                <limel-select
                    label="Favorite hero"
                    value={this.value}
                    options={this.options}
                    onChange={this.onChange}
                />
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
