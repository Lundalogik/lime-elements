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
            icon: 'batman_old',
            iconColor: 'rgb(var(--color-black))',
        },
        {
            text: 'Iron Man',
            value: 'iron',
            disabled: true,
            icon: 'iron_man',
            iconColor: 'rgb(var(--color-coral-default))',
        },
        {
            text: 'Spider-Man',
            value: 'spider',
            icon: 'spiderman_head',
            iconColor: 'rgb(var(--color-red-default))',
        },
        {
            text: 'Superman',
            value: 'super',
            icon: 'superman',
            iconColor: 'rgb(var(--color-blue-default))',
        },
        {
            text: 'Wonder Woman',
            value: 'wonder',
            icon: 'wonder_woman',
            iconColor: 'rgb(var(--color-yellow-darker))',
        },
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <section>
                <limel-select
                    label="Favorite hero"
                    helperText="If you see a lack of diversity, it's our icon-provider's fault"
                    value={this.value}
                    options={this.options}
                    onChange={this.onChange}
                />
                <limel-example-value value={this.value} />
            </section>
        );
    }

    private onChange(event) {
        this.value = event.detail;
    }
}
