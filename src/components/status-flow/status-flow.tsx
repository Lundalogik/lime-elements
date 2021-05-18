import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { FlowItem } from './status-flow.types';

/**
 * @exampleComponent limel-example-status-flow-basic
 * @exampleComponent limel-example-status-flow-colors
 * @exampleComponent limel-example-status-flow-end-steps
 * @exampleComponent limel-example-status-flow-deal
 */
@Component({
    tag: 'limel-status-flow',
    shadow: true,
    styleUrl: 'status-flow.scss',
})
export class StatusFlow {
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
                        <limel-status-flow-item
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
                        <limel-status-flow-item
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
            style['--active-color'] = flowItem.activeColor;
        }

        return style;
    }
}
