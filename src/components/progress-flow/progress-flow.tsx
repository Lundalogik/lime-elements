import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { FlowItem } from './progress-flow.types';

/**
 * @exampleComponent limel-example-progress-flow-basic
 * @exampleComponent limel-example-progress-flow-colors
 * @exampleComponent limel-example-progress-flow-colors-css
 * @exampleComponent limel-example-progress-flow-end-steps
 * @exampleComponent limel-example-progress-flow-deal
 */
@Component({
    tag: 'limel-progress-flow',
    shadow: true,
    styleUrl: 'progress-flow.scss',
})
export class ProgressFlow {
    /**
     * What flow items to render
     */
    @Prop()
    public flowItems: FlowItem[] = [];

    @Event()
    public change: EventEmitter<FlowItem>;

    constructor() {
        this.handleFlowItemClick = this.handleFlowItemClick.bind(this);
    }

    public render() {
        const regularFlowItems = this.flowItems.filter((o) => {
            return !o.isEndPhase;
        });
        const endPhaseItems = this.flowItems.filter((o) => {
            return o.isEndPhase;
        });
        const activeIndex = regularFlowItems.findIndex((o) => {
            return o.selected;
        });

        return [
            endPhaseItems.reverse().map((item, i) => {
                return (
                    <limel-progress-flow-item
                        style={this.getItemStyle(item)}
                        class={{
                            'flow-item': true,
                            'first-end-phase-item':
                                i === endPhaseItems.length - 1,
                        }}
                        item={item}
                        onClick={() => {
                            this.handleFlowItemClick(item);
                        }}
                    />
                );
            }),
            regularFlowItems.reverse().map((item, i) => {
                return (
                    <limel-progress-flow-item
                        class="flow-item"
                        style={this.getItemStyle(item)}
                        item={item}
                        isLast={i === 0}
                        isFirst={i === regularFlowItems.length - 1}
                        isPassed={regularFlowItems.length - i - 1 < activeIndex}
                        onClick={() => {
                            this.handleFlowItemClick(item);
                        }}
                    />
                );
            }),
        ];
    }

    private handleFlowItemClick(flowItem: FlowItem) {
        if (!flowItem.selected) {
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

        return style;
    }
}
