import { Component, h } from '@stencil/core';

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
                <limel-icon name="citrus" size="x-small" />
                <limel-icon name="alps" size="x-small" />
                <limel-icon name="ninja" size="x-small" />
                <limel-icon name="thor_hammer" size="x-small" />
                <limel-icon name="mate" size="x-small" />
                <limel-icon name="croissant" size="x-small" />
            </section>,
            <section class="loving-magenta">
                <h3>Small icons</h3>
                <limel-icon name="citrus" size="small" />
                <limel-icon name="curls_with_dumbbells" size="small" />
                <limel-icon name="bench_press" size="small" />
                <limel-icon name="squats" size="small" />
                <limel-icon name="pullups" size="small" />
                <limel-icon name="pushups" size="small" />
            </section>,
            <section class="simply-blue">
                <h3>Medium icons</h3>
                <limel-icon name="citrus" size="medium" />
                <limel-icon name="day_of_the_tentacle" size="medium" />
                <limel-icon name="bad_piggies" size="medium" />
                <limel-icon name="triforce" size="medium" />
                <limel-icon name="mana" size="medium" />
                <limel-icon name="pokemon" size="medium" />
            </section>,
            <section class="sellable-orange">
                <h3>Large icons</h3>
                <limel-icon name="citrus" size="large" />
                <limel-icon name="dragon" size="large" />
                <limel-icon name="caterpillar" size="large" />
                <limel-icon name="frog" size="large" />
                <limel-icon name="octopus" size="large" />
                <limel-icon name="gorilla" size="large" />
            </section>,
            <section class="custom-size">
                <h3>Custom sized icons</h3>
                <p> Size set in css.</p>
                <limel-icon name="citrus" />
                <limel-icon name="strawberry" />
                <limel-icon name="broccoli" />
                <limel-icon name="paprika" />
                <limel-icon name="pear" />
            </section>,
        ];
    }
}
