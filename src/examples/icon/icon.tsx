import { Component } from '@stencil/core';

@Component({
    tag: 'limel-example-icon',
    shadow: true,
    styleUrl: 'icon.scss',
})
export class IconExample {
    public render() {
        return [
            <section class="lime-green">
                <h3>X-small icons</h3>
                <limel-icon name="plants/citrus" size="x-small" />
                <limel-icon name="Cultures/alps" size="x-small" />
                <limel-icon name="Cultures/ninja" size="x-small" />
                <limel-icon name="Cultures/thor_hammer" size="x-small" />
                <limel-icon name="Cultures/mate" size="x-small" />
                <limel-icon name="Cultures/croissant" size="x-small" />
            </section>,
            <section class="loving-magenta">
                <h3>Small icons</h3>
                <limel-icon name="plants/citrus" size="small" />
                <limel-icon name="Sports/curls_with_dumbbells" size="small" />
                <limel-icon name="Sports/bench_press" size="small" />
                <limel-icon name="Sports/squats" size="small" />
                <limel-icon name="Sports/pullups" size="small" />
                <limel-icon name="Sports/pushups" size="small" />
            </section>,
            <section class="simply-blue">
                <h3>Medium icons</h3>
                <limel-icon name="plants/citrus" size="medium" />
                <limel-icon name="gaming/day_of_the_tentacle" size="medium" />
                <limel-icon name="gaming/bad_piggies" size="medium" />
                <limel-icon name="gaming/triforce" size="medium" />
                <limel-icon name="gaming/mana" size="medium" />
                <limel-icon name="gaming/pokemon" size="medium" />
            </section>,
            <section class="sellable-orange">
                <h3>Large icons</h3>
                <limel-icon name="plants/citrus" size="large" />
                <limel-icon name="animals/dragon" size="large" />
                <limel-icon name="animals/caterpillar" size="large" />
                <limel-icon name="animals/frog" size="large" />
                <limel-icon name="animals/octopus" size="large" />
                <limel-icon name="animals/gorilla" size="large" />
            </section>,
            <section class="custom-size">
                <h3>Custom sized icons</h3>
                <p> Size set in css.</p>
                <limel-icon name="plants/citrus" />
                <limel-icon name="plants/strawberry" />
                <limel-icon name="plants/broccoli" />
                <limel-icon name="plants/paprika" />
                <limel-icon name="plants/pear" />
            </section>,
        ];
    }
}
