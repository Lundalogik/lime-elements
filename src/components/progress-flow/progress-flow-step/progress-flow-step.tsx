import { Component, Element, h, Prop } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * @private
 */
@Component({
    tag: 'limel-progress-flow-step',
    shadow: true,
    styleUrl: 'progress-flow-step.scss',
})
export class ProgressFlowItem {
    @Element()
    public element: HTMLLimelProgressFlowItemElement;

    @Prop()
    public item: FlowItem = null;

    @Prop()
    public isFirst: boolean = false;

    @Prop()
    public isLast: boolean = false;

    @Prop()
    public isPassed: boolean = false;

    /**
     * Icon displayed along with the text optionally
     */
    @Prop()
    public icon: string;

    public render() {
        return (
            <button
                title={this.item.text}
                type="button"
                class={{
                    'flow-step': true,
                    'passed-phase': this.isPassed,
                    'off-progress-step': this.item?.isEndPhase,
                    active: this.item?.selected,
                    first: this.isFirst,
                    last: this.isLast,
                }}
            >
                {this.renderIcon()}
                <span class="flow-step-text">{this.item.text}</span>
                <div class="flow-step-divider"/>
            </button>
        );
    }
    private renderIcon() {
        if (!this.item.icon) {
            return;
        }

        return (
            <limel-icon
                name={this.item.icon}
                size="small"
                class="flow-step-icon"
            />
        );
    }
}
