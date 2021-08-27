import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Alternative UI
 *
 * You can render the component with an alternative layout which may be good for
 * some use cases. To achive this, simply add the `has-detached-steps` to the
 * component.
 * :::tip
 * This design is more suitable when the user is not expected to go through
 * the process by manually clicking on each step.
 *
 * For example when you only want to visualize status of process when things are
 * happening without user's direct engagement.
 * :::
 * :::note
 * The `is-narrow` class does not affect this UI alternative.
 * :::
 */
@Component({
    tag: 'limel-example-progress-flow-alternative-ui',
    shadow: true,
})
export class ProgressFlowAlternativeUiExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: 'placemend',
            text: 'Order placed',
            secondaryText: 'Yesterday, 19:37',
            icon: 'add_shopping_cart',
            selectedColor: 'rgb(var(--color-orange-default))',
        },
        {
            value: 'payment',
            text: 'Payment successful',
            secondaryText: 'Credit card',
            icon: 'money',
            selectedColor: 'rgb(var(--color-green-default))',
        },
        {
            value: 'confirmation',
            text: 'Order confirmed',
            secondaryText: 'Today, 07:15',
            selected: true,
            icon: 'ok',
            selectedColor: 'rgb(var(--color-sky-default))',
        },
        {
            value: 'process',
            text: 'Order processed',
            selectedColor: 'rgb(var(--color-teal-default))',
            icon: 'packaging',
        },
        {
            value: 'shipment',
            text: 'Ready to pickup',
            selectedColor: 'rgb(var(--color-teal-default))',
            icon: 'agreement',
        },
        {
            value: 'cancel',
            text: 'Order cancelled',
            isOffProgress: true,
            icon: 'return_purchase',
            iconColor: 'rgb(var(--color-red-dark))',
            selectedColor: 'rgb(var(--color-red-dark))',
        },
        {
            value: 'returned',
            text: 'Package retuned',
            isOffProgress: true,
            icon: 'return',
            iconColor: 'rgb(var(--color-coral-default))',
            selectedColor: 'rgb(var(--color-coral-default))',
        },
    ];

    public render() {
        return (
            <limel-progress-flow
                flowItems={this.flowItems}
                onChange={this.handleChange}
                class="has-detached-steps"
                readonly={true}
            />
        );
    }

    private handleChange = (event: CustomEvent<FlowItem>) => {
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    };
}
