import { Component, State } from '@stencil/core';
import { Option } from '../../interface';

@Component({
    shadow: true,
    tag: 'limel-example-select',
})
export class SelectExample {
    @State()
    public basicValue: string;

    @State()
    public initallyEmptyValue: string = '';

    @State()
    public initallyEmptyRequiredValue: string = '';

    @State()
    public toggleValue: string;

    @State()
    public disabled = false;

    @State()
    public optionGroup = 0;

    private basicOptions: Option[] = [
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    private initallyEmptyOptions: Option[] = [
        { text: '', value: '' },
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    private initallyEmptyRequiredOptions: Option[] = [
        { text: '', value: '', disabled: true },
        { text: 'Luke Skywalker', value: 'luke' },
        { text: 'Han Solo', value: 'han' },
        { text: 'Leia Organo', value: 'leia' },
    ];

    private toggleOptions: Option[][] = [
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

    public render() {
        return [
            <section>
                <h3>Basic Usage</h3>
                <limel-select
                    options={this.basicOptions}
                    value={this.basicValue}
                    label="Favorite hero"
                    onChange={event => {
                        this.basicValue = event.detail;
                    }}
                />
                <p>Value: {this.basicValue}</p>
            </section>,
            <section>
                <h3>Initially Empty</h3>
                <limel-select
                    options={this.initallyEmptyOptions}
                    value={this.initallyEmptyValue}
                    label="Favorite hero"
                    onChange={event => {
                        this.initallyEmptyValue = event.detail;
                    }}
                />
                <p>Value: {this.initallyEmptyValue}</p>
            </section>,
            <section>
                <h3>Initially Empty but the Empty Option Cannot be Selected</h3>
                <limel-select
                    options={this.initallyEmptyRequiredOptions}
                    value={this.initallyEmptyRequiredValue}
                    label="Favorite hero"
                    onChange={event => {
                        this.initallyEmptyRequiredValue = event.detail;
                    }}
                />
                <p>Value: {this.initallyEmptyRequiredValue}</p>
            </section>,
            <section>
                <h3>Changing Available Options</h3>
                <limel-button-group>
                    <limel-button
                        primary={true}
                        onClick={() => {
                            this.disabled = !this.disabled;
                        }}
                        label={this.disabled ? 'Enable' : 'Disable'}
                    />

                    <limel-button
                        primary={true}
                        onClick={() => {
                            this.optionGroup =
                                (this.optionGroup + 1) %
                                this.toggleOptions.length;
                        }}
                        label="Toggle options"
                    />
                </limel-button-group>
                <limel-select
                    options={this.toggleOptions[this.optionGroup]}
                    value={this.toggleValue}
                    disabled={this.disabled}
                    label="Favorite hero"
                    onChange={event => {
                        this.toggleValue = event.detail;
                        console.log(event.detail);
                    }}
                />
                <p>Value: {this.toggleValue}</p>
                <p>
                    Currently showing option group: {this.optionGroup + 1} /{' '}
                    {this.toggleOptions.length}
                </p>
            </section>,
            <hr />,
            <p>
                When importing Option, see{' '}
                <a href="/usage#import-statements">Usage</a>
            </p>,
        ];
    }
}
