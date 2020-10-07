import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Initially Empty but the Empty Option Cannot Be Reselected
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-initially-empty-required',
})
export class SelectExample {
    @State()
    public value: Option;

    private options: Option[] = [
        { text: '', value: '', disabled: true },
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
                    required={true}
                />
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
