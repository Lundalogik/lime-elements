import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With Empty Option
 *
 * Adding an empty option makes it possible for the user to "unset"
 * the value. Try selecting a value below, and then selecting the empty
 * option again.
 *
 * If the component is set as required, the empty option is removed.
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-with-empty-option',
})
export class SelectWithEmptyOptionExample {
    @State()
    public value: Option;

    @State()
    public required = false;

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
                    required={this.required}
                    onChange={this.handleChange}
                />
                <kompendium-example-controls>
                    <limel-checkbox
                        checked={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                </kompendium-example-controls>
                <kompendium-example-value value={this.value} />
            </section>
        );
    }

    private handleChange = (event: LimelSelectCustomEvent<Option<string>>) => {
        this.value = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };
}
