import { Component, State } from '@stencil/core';
import { IOption } from '../../components/select/option';

@Component({
    shadow: true,
    tag: 'docs-limel-select',
})
export class SelectExample {
    @State() public disabled = false;
    @State() public group = 0;

    private options: IOption[][] = [
        [
            { text: '', value: '', disabled: true },
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
    ];

    public render() {
        return [
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
                        this.group = (this.group + 1) % this.options.length;
                    }}
                    label="Toggle options"
                />
            </limel-button-group>,
            <limel-select
                options={this.options[this.group]}
                disabled={this.disabled}
                label="Favorite hero"
                onChange={event => {
                    console.log(event);
                }}
            />,
        ];
    }
}
