import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { FlowItem } from './progress-flow.types';

/**
 * @exampleComponent limel-example-progress-flow-basic
 * @exampleComponent limel-example-progress-flow-colors
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

        return (
            <limel-flex-container
                class="flow-container"
                direction="horizontal"
                align="start"
                justify="start"
                reverse={true}
            >
                {endPhaseItems.reverse().map((item, i) => {
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
                })}
                {regularFlowItems.reverse().map((item, i) => {
                    return (
                        <limel-progress-flow-item
                            class="flow-item"
                            style={this.getItemStyle(item)}
                            item={item}
                            isLast={i === 0}
                            isFirst={i === regularFlowItems.length - 1}
                            onClick={() => {
                                this.handleFlowItemClick(item);
                            }}
                        />
                    );
                })}
            </limel-flex-container>
        );
    }

    private handleFlowItemClick(flowItem: FlowItem) {
        if (!flowItem.selected) {
            this.change.emit(flowItem);
        }
    }

    private getItemStyle(flowItem: FlowItem) {
        const style: any = {};
        if (flowItem?.activeColor) {
            style['--progress-flow-active-step-background-color'] = flowItem.activeColor;
        }

        return style;
    }
}
