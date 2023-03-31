import { Component, h } from '@stencil/core';

/**
 * With custom `heading`
 *
 * By default, the title will equal the `type` qualifier.
 * However, it is possible to use a `type` just to get the desired visualisation
 * (icon and color), but override the default heading, using the `heading` prop.
 */
@Component({
    tag: 'limel-example-callout-custom-heading',
    shadow: true,
})
export class CalloutCustomTitleExample {
    public render() {
        return (
            <limel-callout type="success" heading="🥳 yeay!">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vestibulum viverra magna non pretium condimentum. Integer a
                    nunc magna. In commodo elit turpis, porttitor vulputate odio
                    pretium a. Ut at sapien a massa convallis commodo eu sed
                    ligula. Curabitur non sodales neque. Sed id nisl vel ex
                    tempor euismod. Nulla nec lorem dui. Cras tincidunt urna nec
                    velit pretium maximus.
                </p>

                <p>
                    Praesent sed cursus lorem. Phasellus lobortis dolor vitae
                    pretium bibendum. Vivamus non augue in urna consequat
                    dapibus at quis diam. Duis tristique lacinia felis, quis
                    condimentum urna interdum sit amet. Suspendisse facilisis
                    pulvinar suscipit. Pellentesque quis velit feugiat, bibendum
                    erat at, ornare tortor. Nullam sed risus a enim tempor
                    eleifend nec quis nulla. Cras quis pellentesque justo.
                    Maecenas id justo a eros consequat auctor.
                </p>
            </limel-callout>
        );
    }
}
