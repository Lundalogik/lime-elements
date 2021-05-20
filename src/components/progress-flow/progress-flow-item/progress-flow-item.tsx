import { Component, Element, h, Prop } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * @private
 */
@Component({
    tag: 'limel-progress-flow-item',
    shadow: true,
    styleUrl: 'progress-flow-item.scss',
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

    public render() {
        return (
            <button
                title={this.item.text}
                type="button"
                class={{
                    'btn-flow': true,
                    'end-phase': this.item?.isEndPhase,
                    active: this.item?.selected,
                    first: this.isFirst,
                    last: this.isLast,
                }}
            >
                <span class="btn-flow-text">{this.item.text}</span>
            </button>
        );
    }
}
