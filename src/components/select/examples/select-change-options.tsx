import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Changing Available Options
 *
 * This example shows how the component works when options are changed
 * programmatically during the lifetime of the component.
 *
 * We have 5 different sets of options:
 * 1. A set of options with an empty and disabled first option. This is used to ensure that the empty option cannot be re-selected.
 * 2. A set of options with an empty but non-disabled first option. This is used to ensure that the empty option can be re-selected.
 * 3. An empty array. This is used to ensure that the component can handle an empty set of options. To load the component with an empty set of options, select this group, then click the "Reinitialize" button.
 * 4. A set of 3 options.
 * 5. A set of 4 options. Set 4 and 5 are used to ensure that the component can handle sets of different sizes.
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-change-options',
})
export class SelectExample {
    @State()
    private value: Option;

    @State()
    private disabled = false;

    @State()
    private currentOptionGroup = 0;

    @State()
    private key = crypto.randomUUID();

    private optionGroups: Option[][] = [
        [
            { text: '', value: '', disabled: true },
            { text: 'Bart Simpson', value: 'bart' },
            { text: 'Ned Flanders', value: 'ned' },
        ],
        [
            { text: '', value: '' },
            { text: 'Homer Simpson', value: 'homer' },
            { text: 'Moe Szyslak', value: 'moe' },
            { text: 'Ned Flanders', value: 'ned' },
        ],
        [],
        [
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ],
        [
            { text: 'David Tennant', value: '10' },
            { text: 'Matt Smith', value: '11' },
            { text: 'Peter Capaldi', value: '12' },
            { text: 'Jodie Witthaker', value: '13' },
        ],
    ];

    private optionGroupSelectOptions: Option[] = [
        { text: '1 - with empty disabled first option', value: '0' },
        { text: '2 - with empty non-disabled first option', value: '1' },
        { text: '3 - empty set', value: '2' },
        { text: '4 - 3 options', value: '3' },
        { text: '5 - 4 options', value: '4' },
    ];

    public componentWillLoad() {
        this.selectFirstValue();
    }

    public render() {
        return (
            <Host>
                <limel-select
                    label="Favorite hero"
                    value={this.value}
                    options={this.optionGroups[this.currentOptionGroup]}
                    disabled={this.disabled}
                    onChange={this.handleChange}
                    key={this.key}
                />
                <limel-example-controls>
                    <limel-select
                        label="Select Options Group"
                        options={this.optionGroupSelectOptions}
                        value={
                            this.optionGroupSelectOptions[
                                this.currentOptionGroup
                            ]
                        }
                        onChange={this.handleOptionsGroupChange}
                    />
                    <limel-button
                        label={this.disabled ? 'Enable' : 'Disable'}
                        onClick={this.toggleEnabled}
                    />
                    <limel-button
                        label="Unset value"
                        onClick={this.unsetValue}
                    />
                    <limel-button
                        label="Select first value in group"
                        onClick={this.selectFirstValue}
                    />
                    <limel-button
                        label="Reinitialize"
                        onClick={this.reinitialize}
                    />
                </limel-example-controls>
                <limel-example-value value={this.value} />
                <limel-example-value
                    label="Currently showing option group"
                    value={`${this.currentOptionGroup + 1} / ${
                        this.optionGroups.length
                    }`}
                />
            </Host>
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };

    private toggleEnabled = () => {
        this.disabled = !this.disabled;
    };

    private handleOptionsGroupChange = (
        event: LimelSelectCustomEvent<Option>
    ) => {
        event.stopPropagation();
        this.currentOptionGroup = +event.detail.value;
    };

    private unsetValue = () => {
        this.value = undefined;
    };

    private selectFirstValue = () => {
        this.value = this.optionGroups[this.currentOptionGroup][0];
    };

    private reinitialize = () => {
        // We need to change the key to force destruction and recreation of the
        // component. This is necessary to ensure that the component can handle
        // being reinitialized with an empty set of options.
        this.key = crypto.randomUUID();
    };
}
