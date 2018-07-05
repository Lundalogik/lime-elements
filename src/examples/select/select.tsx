import { Component, State } from '@stencil/core';
import { IOption } from '../../components/select/option';

@Component({
    tag: 'limel-example-select',
    shadow: true
})
export class SelectExample {

    @State() disabled: boolean = false;
    @State() group: number = 0;

    private options: Array<Array<IOption>> = [
        [
            { text: '', value: '', disabled: true },
            { text: 'Luke Skywalker', value: 'luke' },
            { text: 'Han Solo', value: 'han' },
            { text: 'Leia Organo', value: 'leia' }
        ], [
            { text: '', value: '' },
            { text: 'Homer Simpson', value: 'homer' },
            { text: 'Moe Szyslak', value: 'moe' },
            { text: 'Ned Flanders', value: 'ned' }
        ]
    ];

    render() {
        return [
            <limel-button-group>
                <limel-button primary
                    onClick={() => this.disabled = !this.disabled}
                    label={this.disabled ? 'Enable' : 'Disable'}/>

                <limel-button primary
                    onClick={() => this.group = (this.group + 1) % 2}
                    label="Toggle options"/>
            </limel-button-group>,
            <limel-select
                options={this.options[this.group]}
                disabled={this.disabled}
                label="Favorite hero"
                onChange={event => console.log(event)} />
        ];
    }

}
