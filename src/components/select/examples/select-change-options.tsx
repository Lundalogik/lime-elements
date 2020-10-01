import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-select-change-options',
})
export class SelectExample {
    @State()
    public value: Option;

    @State()
    public disabled = false;

    @State()
    public currentOptionGroup = 0;

    private optionGroups: Option[][] = [
        [
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' },
        ],
        [
            { text: '', value: '' },
            { text: 'Homer Simpson', value: 'homer' },
            { text: 'Moe Szyslak', value: 'moe' },
            { text: 'Ned Flanders', value: 'ned' },
        ],
        [
            { text: '', value: '', disabled: true },
            { text: 'Bart Simpson', value: 'bart' },
            { text: 'Ned Flanders', value: 'ned' },
        ],
        [
            { text: 'David Tennant', value: '10' },
            { text: 'Matt Smith', value: '11' },
            { text: 'Peter Capaldi', value: '12' },
            { text: 'Jodie Witthaker', value: '13' },
        ],
        [],
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.changeOptionsGroup = this.changeOptionsGroup.bind(this);
    }

    public render() {
        return (
            <section>
                <limel-select
                    label="Favorite hero"
                    value={this.value}
                    options={this.optionGroups[this.currentOptionGroup]}
                    disabled={this.disabled}
                    onChange={this.onChange}
                />
                <p>
                    <limel-flex-container justify="end">
                        <limel-button
                            label={this.disabled ? 'Enable' : 'Disable'}
                            onClick={this.toggleEnabled}
                        />
                        <limel-button
                            label="Change Options"
                            onClick={this.changeOptionsGroup}
                        />
                    </limel-flex-container>
                </p>
                <limel-example-value value={this.value} />
                <limel-example-value
                    label="Currently showing option group"
                    value={`${this.currentOptionGroup + 1} / ${
                        this.optionGroups.length
                    }`}
                />
            </section>
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }

    private changeOptionsGroup() {
        this.currentOptionGroup =
            (this.currentOptionGroup + 1) % this.optionGroups.length;
    }
}
