import { LimelSelectCustomEvent, Option } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Multiple select with icons
 *
 * When using `multiple={true}` with options that have icons,
 * the icons are displayed inline with each selected option's text.
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-multiple-icons',
})
export class SelectMultipleIconsExample {
    @State()
    public value: Option[] = [];

    private options: Option[] = [
        {
            text: 'Batman',
            value: 'bat',
            icon: {
                name: 'batman_old',
                color: 'rgb(var(--color-black))',
            },
        },
        {
            text: 'Iron Man',
            value: 'iron',
            icon: {
                name: 'iron_man',
                color: 'rgb(var(--color-coral-default))',
            },
        },
        {
            text: 'Spider-Man',
            value: 'spider',
            icon: {
                name: 'spiderman_head',
                color: 'rgb(var(--color-red-default))',
            },
        },
        {
            text: 'Superman',
            value: 'super',
            icon: {
                name: 'superman',
                color: 'rgb(var(--color-blue-default))',
            },
        },
        {
            text: 'Wonder Woman',
            value: 'wonder',
            icon: {
                name: 'wonder_woman',
                color: 'rgb(var(--color-yellow-darker))',
            },
        },
    ];

    public render() {
        return (
            <Host>
                <limel-select
                    label="Favorite heroes"
                    helperText="Select multiple heroes to see their icons"
                    value={this.value}
                    options={this.options}
                    onChange={this.handleChange}
                    multiple={true}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: LimelSelectCustomEvent<Option[]>) => {
        this.value = event.detail;
    };
}
