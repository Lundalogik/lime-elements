import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Select with icons for options
 */
@Component({
    shadow: true,
    tag: 'limel-example-select-with-icons',
})
export class SelectExample {
    @State()
    public value: Option;

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
            disabled: true,
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
            <section>
                <limel-select
                    label="Favorite hero"
                    helperText="If you see a lack of diversity, it's our icon-provider's fault"
                    value={this.value}
                    options={this.options}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };
}
