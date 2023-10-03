import {
    FlexContainerAlign,
    FlexContainerDirection,
    FlexContainerJustify,
} from '../../interface';
import { Component, h, Prop } from '@stencil/core';

/**
 * This component is deprecated and will be removed in a future version of
 * Lime Elements. Please use CSS for your flexible container needs 🙂
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox
 * @deprecated
 * @private
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

    public componentWillLoad() {
        /* eslint-disable-next-line no-console */
        console.warn(
            'limel-flex-container is deprecated, please use CSS instead: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox'
        );
    }

    public render() {
        return <slot />;
    }
}
