import {
    FlexContainerAlign,
    FlexContainerDirection,
    FlexContainerJustify,
} from '@limetech/lime-elements';
import { Component, h, Prop } from '@stencil/core';

/**
 * @exampleComponent limel-example-flex-container
 * @slot - Container content
 */
@Component({
    tag: 'limel-flex-container',
    shadow: true,
    styleUrl: 'flex-container.scss',
})
export class FlexContainer {
    /**
     * Direction of the main axis
     */
    @Prop({ reflect: true })
    public direction: FlexContainerDirection = 'horizontal';

    /**
     * Specify how items are aligned along the main axis
     */
    @Prop({ reflect: true })
    public justify: FlexContainerJustify = 'space-between';

    /**
     * Specify how items are aligned along the cross axis
     */
    @Prop({ reflect: true })
    public align: FlexContainerAlign = 'center';

    /**
     * Reverse the order of the items
     */
    @Prop({ reflect: true })
    public reverse = false;

    public render() {
        return <slot />;
    }
}
