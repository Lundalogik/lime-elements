import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Narrow layout
 * The `limel-select` component has the same height and layout as other input types
 * in Lime elements. This makes the UI nice and tidy, when elements are placed
 * beside or on top of each other; for instance in a form.
 *
 * However, sometimes you may need to render the `limel-select` component with a
 * narrower layout (smaller in height). For instance when the component is used
 * in a header, or when it is placed beside a component like `limel-button-group`.
 *
 * For such cases, you can simply apply the class of `is-narrow` to your component.
 * :::tip
 * In such use cases, the select usually does not need a `label`. Consider having
 * its first `option` pre-chosen and displayed by default instead. Also avoid using
 * `helperText` if possible.
 * :::
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-narrow',
    styleUrl: 'select-narrow.scss',
})
export class SelectExample {
    @State()
    public value: Option = {
        text: 'select a colleague',
        value: 'colleague',
        disabled: true,
    };

    private options: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <limel-header
                icon="combo_chart"
                heading="Sale performance"
                subheading="Choose a colleague to see their statistics"
            >
                <limel-select
                    class="is-narrow"
                    value={this.value}
                    options={this.options}
                    onChange={this.onChange}
                />
            </limel-header>
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
