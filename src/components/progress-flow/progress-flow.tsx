import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import { FlowItem } from './progress-flow.types';

/**
 * @exampleComponent limel-example-progress-flow-basic
 * @exampleComponent limel-example-progress-flow-secondary-text
 * @exampleComponent limel-example-progress-flow-colors
 * @exampleComponent limel-example-progress-flow-colors-css
 * @exampleComponent limel-example-progress-flow-end-steps
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

    @Event()
    public change: EventEmitter<FlowItem>;

    constructor() {
        this.handleFlowItemClick = this.handleFlowItemClick.bind(this);
    }

    public render() {
        const regularFlowItems = this.flowItems.filter((o) => {
            return !o.isOffProgress;
        });
        const endPhaseItems = this.flowItems.filter((o) => {
            return o.isOffProgress;
        });
        const activeIndex = regularFlowItems.findIndex((o) => {
            return o.selected;
        });

        return [
            endPhaseItems.reverse().map((item, i) => {
                return (
                    <limel-progress-flow-item
                        class={{
                            'flow-item': true,
                            'lime-progress-flow--readonly': this.readonly,
                            'first-off-progress':
                            i === endPhaseItems.length - 1,
                        }}
                        style={this.getItemStyle(item)}
                        disabled={this.disabled || this.readonly}
                        readonly={this.readonly}
                        item={item}
                        onInteract={() => {
                            this.handleFlowItemClick(item);
                        }}
                    />
                );
            }),
            regularFlowItems.reverse().map((item, i) => {
                return (
                    <limel-progress-flow-item
                        class={{
                            'flow-item': true,
                            'lime-progress-flow--readonly': this.readonly,
                        }}
                        style={this.getItemStyle(item)}
                        disabled={this.disabled || this.readonly}
                        readonly={this.readonly}
                        item={item}
                        isLast={i === 0}
                        isFirst={i === regularFlowItems.length - 1}
                        isPassed={regularFlowItems.length - i - 1 < activeIndex}
                        onInteract={() => {
                            this.handleFlowItemClick(item);
                        }}
                    />
                );
            }),
        ];
    }

    private handleFlowItemClick(flowItem: FlowItem) {
        if (!flowItem.selected && !flowItem.disabled && !this.disabled) {
            this.change.emit(flowItem);
        }
    }

    private getItemStyle(flowItem: FlowItem) {
        const style: any = {};
        if (flowItem?.activeColor) {
            style['--progress-flow-step-background-color--active'] =
                flowItem.activeColor;
        }

        if (flowItem?.passedColor) {
            style['--progress-flow-step-background-color--passed'] =
                flowItem.passedColor;
        }

        if (flowItem?.iconColor) {
            style['--progress-flow-icon-color--inactive'] = flowItem.iconColor;
        }

        return style;
    }

    public componentDidRender() {
        this.setFocusOnActiveItem();
    }

    private setFocusOnActiveItem() {
        const activeElement = this.getActiveElement();
        if (activeElement) {
            const activeItemLeftPosition =
                activeElement.offsetLeft - this.element.offsetLeft;
            const activeElementLeftPositionCenterd =
                activeItemLeftPosition - this.element.offsetWidth / 2;
            const activeElementCentered =
                activeElementLeftPositionCenterd +
                activeElement.offsetWidth / 2;
            this.element.scrollTo({
                behavior: 'smooth',
                left: activeElementCentered,
            });
        }
    }

    private getActiveElement(): HTMLLimelProgressFlowItemElement {
        const items = this.element.shadowRoot.querySelectorAll('.flow-item');
        for (let i = 0; i < items.length; i++) {
            const element: any = items[i];
            const buttonElement = element.shadowRoot.querySelector('.active');
            if (buttonElement) {
                return element;
            }
        }
    }
}
