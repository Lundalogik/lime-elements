import { Component, State } from '@stencil/core';
import { Option } from '../../interface';

@Component({
    tag: 'limel-example-grid-fullpage',
    shadow: false,
    styleUrl: 'grid-fullpage.scss',
})
export class GridFullpageExample {
    @State()
    private emulatedScreenWidth: Option = { text: 'Large', value: ' ' };

    private options: Option[] = [
        { text: 'Large', value: ' ' },
        { text: 'Medium', value: 'device-state-tellus' },
        { text: 'Small', value: 'device-state-mars' },
    ];

    public render() {
        return (
            <fake-webclient class={`${this.emulatedScreenWidth.value}`}>
                <limel-select
                    options={this.options}
                    value={this.emulatedScreenWidth}
                    label="Emulated screen width"
                    onChange={event => {
                        this.emulatedScreenWidth = event.detail;
                    }}
                />
                <br />
                <br />

                <div class="limel-example-grid--grid-fullpage">
                    <my-deep-red-widget />
                    <my-red-widget />
                    <my-orange-widget />
                    <my-yellow-widget />
                    <my-green-widget />
                    <my-turquoise-widget />
                    <my-blue-widget />
                    <my-dark-blue-widget />
                    <my-magenta-widget />
                    <my-light-grey-widget />
                    <my-dark-grey-widget />
                </div>
            </fake-webclient>
        );
    }
}
