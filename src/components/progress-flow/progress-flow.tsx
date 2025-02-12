import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import { FlowItem } from './progress-flow.types';
import { getIconColor } from '../icon/get-icon-props';

/**
 * @exampleComponent limel-example-progress-flow-basic
 * @exampleComponent limel-example-progress-flow-secondary-text
 * @exampleComponent limel-example-progress-flow-disabled-step
 * @exampleComponent limel-example-progress-flow-colors
 * @exampleComponent limel-example-progress-flow-colors-css
 * @exampleComponent limel-example-progress-flow-off-progress-steps
 * @exampleComponent limel-example-progress-flow-narrow
 */
@Component({
    tag: 'limel-progress-flow',
    shadow: true,
    styleUrl: 'progress-flow.scss',
})
export class ProgressFlow {
    @Element()
    public element: HTMLLimelProgressFlowElement;

    /**
     * What flow items to render
     */
    @Prop()
    public flowItems: FlowItem[] = [];

    /**
     * Set to `true` to disable the progress flow.
     * Use `disabled` to indicate that the component can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the field may become enabled again.
     */
    @Prop()
    public disabled = false;

    /**
     * Disables the progress flow when `true`.
     * This does not visualize the component that much differently.
     * But since the component does not provide any feedback that users can
     * interact with the component, it makes it perfect for illustrative and
     * informative porpuses.
     */
    @Prop()
    public readonly = false;

    /**
     * Fired when a new value has been selected from the progress flow
     */
    @Event()
    public change: EventEmitter<FlowItem>;

    private selectedItemIndex: number;

    public componentDidRender() {
        this.scrollToSelectedItem();
    }

    public componentDidLoad() {
        this.triggerIconColorWarning();
    }

    public render() {
        const regularFlowItems = this.flowItems.filter((item) => {
            return !item.isOffProgress;
        });
        const endPhaseItems = this.flowItems.filter((item) => {
            return item.isOffProgress;
        });
        this.selectedItemIndex = regularFlowItems.findIndex((item) => {
            return item.selected;
        });

        return [
            regularFlowItems.map(this.renderRegularFlowItem),
            endPhaseItems.map(this.renderEndPhaseItem),
        ];
    }

    private renderRegularFlowItem = (
        item: FlowItem,
        index: number,
        array: FlowItem[],
    ) => {
        return (
            <limel-progress-flow-item
                class={{
                    'flow-item': true,
                    first: index === 0,
                    last: index === array.length - 1,
                    passed: index < this.selectedItemIndex,
                    selected: item.selected,
                }}
                style={this.getItemStyle(item)}
                disabled={this.disabled || this.readonly}
                readonly={this.readonly}
                item={item}
                onInteract={this.handleFlowItemClick(item)}
                data-tracking-value={item.value}
                currentStep={index === this.selectedItemIndex}
            />
        );
    };

    private renderEndPhaseItem = (
        item: FlowItem,
        index: number,
        array: FlowItem[],
    ) => {
        return (
            <limel-progress-flow-item
                class={{
                    'flow-item': true,
                    'off-progress-item': true,
                    selected: item.selected,
                    'first-off-progress-item': index === 0,
                    'last-off-progress-item': index === array.length - 1,
                }}
                style={this.getItemStyle(item)}
                disabled={this.disabled || this.readonly}
                readonly={this.readonly}
                item={item}
                onInteract={this.handleFlowItemClick(item)}
                data-tracking-value={item.value}
            />
        );
    };

    private handleFlowItemClick = (flowItem: FlowItem) => () => {
        if (!flowItem.selected && !flowItem.disabled && !this.disabled) {
            this.change.emit(flowItem);
        }
    };

    private getItemStyle(flowItem: FlowItem) {
        // eslint-disable-next-line sonarjs/deprecation
        const color = getIconColor(flowItem.icon, flowItem.iconColor);
        const style: any = {};

        if (flowItem?.selectedColor) {
            style['--progress-flow-step-background-color--selected'] =
                flowItem.selectedColor;
        }

        if (flowItem?.passedColor) {
            style['--progress-flow-step-background-color--passed'] =
                flowItem.passedColor;
        }

        if (color) {
            style['--progress-flow-icon-color--inactive'] = color;
        }

        return style;
    }

    private scrollToSelectedItem() {
        const selectedElement = this.getElementForSelectedItem();
        if (selectedElement) {
            const selectedItemLeftPosition =
                selectedElement.offsetLeft - this.element.offsetLeft;
            const selectedElementLeftPositionCentered =
                // eslint-disable-next-line no-magic-numbers
                selectedItemLeftPosition - this.element.offsetWidth / 2;
            const selectedElementCentered =
                selectedElementLeftPositionCentered +
                // eslint-disable-next-line no-magic-numbers
                selectedElement.offsetWidth / 2;
            this.element.scrollTo({
                behavior: 'smooth',
                left: selectedElementCentered,
            });
        }
    }

    private getElementForSelectedItem(): HTMLLimelProgressFlowItemElement {
        return this.element.shadowRoot.querySelector('.flow-item.selected');
    }

    private triggerIconColorWarning() {
        for (const flowItem of this.flowItems) {
            // eslint-disable-next-line sonarjs/deprecation
            if (flowItem.iconColor) {
                /* eslint-disable-next-line no-console */
                console.warn(
                    "The `iconColor` prop is deprecated now! Use the new `Icon` interface and instead of `iconColor: 'color-name'` write `icon {name: 'icon-name', color: 'color-name'}`.",
                );
            }
        }
    }
}
