import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With Empty Option
 *
 * Adding an empty option makes it possible for the user to "unset"
 * any chosen value.
 *
 * This example demonstrates two different approaches to empty options in select components:
 *
 * **1. Unlabeled empty option**:
 * A select with a completely empty option (both `text` and `value` are empty).
 *
 * Provides a way to clear a selection without any visible text.
 * This works well when the select's purpose is clear from context
 * and "no selection" feels intuitive.
 *
 * **2. Labeled empty option**:
 * A select with a labeled empty option (using a label as `text`,
 * but with an empty `value`).
 *
 * This approach uses descriptive labels like "All", "None", while still
 * having an empty `value`. When good labels are used in the right context,
 * this improves clarity for users by explicitly communicating what an empty
 * selection means in this specific context.
 *
 * Try selecting a value below, and then selecting the empty
 * option again. Notice how the select's UI resets to an empty default state,
 * if no `text` is provided to label the empty option.
 *
 * :::important
 * If the component is set as `required`, and the empty option is unlabeled,
 * it will be removed from the list.
 * This is to ensure that if users open the required dropdown,
 * and close it without selecting anything, the component can make set
 * itself to `invalid`, forcing the user to choose a choice,
 * before being able to continue.
 *
 * However, when the empty option is labeled, it will remain in the list,
 * even if the component is set as `required`. This can be confusing for users,
 * as they may not understand why the empty option is still available and selectable,
 * but once selected, the component becomes `invalid`.
 * :::
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-with-empty-option',
})
export class SelectWithEmptyOptionExample {
    @State()
    public value1: Option;

    @State()
    public value2: Option;

    @State()
    public required = false;

    private optionsWithUnlabeledEmpty: Option[] = [
        { text: '', value: '' },
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organa', value: 'leia' },
        { text: 'Obi-Wan Kenobi', value: 'obi-wan' },
    ];

    private optionsWithLabeledEmpty: Option[] = [
        { text: 'None', value: '' },
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organa', value: 'leia' },
        { text: 'Obi-Wan Kenobi', value: 'obi-wan' },
    ];

    public render() {
        return (
            <section>
                <h4>Unlabeled Empty Option</h4>
                <limel-select
                    label="Select a character"
                    value={this.value1}
                    options={this.optionsWithUnlabeledEmpty}
                    required={this.required}
                    onChange={this.handleChange1}
                />
                <limel-example-value value={this.value1} />

                <h4>Labeled Empty Option</h4>
                <limel-select
                    label="Select a character"
                    value={this.value2}
                    options={this.optionsWithLabeledEmpty}
                    required={this.required}
                    onChange={this.handleChange2}
                />
                <limel-example-value value={this.value2} />

                <limel-example-controls>
                    <limel-switch
                        value={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                </limel-example-controls>
            </section>
        );
    }

    private handleChange1 = (event: LimelSelectCustomEvent<Option<string>>) => {
        this.value1 = event.detail;
    };

    private handleChange2 = (event: LimelSelectCustomEvent<Option<string>>) => {
        this.value2 = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };
}
