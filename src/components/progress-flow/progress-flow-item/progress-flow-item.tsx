import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
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

    @Prop()
    public isPassed: boolean = false;

    @Prop()
    public disabled = false;

    @Event()
    public interact: EventEmitter<void>;

    /**
     * Icon displayed along with the text optionally
     */
    @Prop()
    public icon: string;

    public render() {
        return [
            <button
                title={this.item.text}
                type="button"
                class={{
                    'btn-flow': true,
                    passed: this.isPassed,
                    'off-progress-step': this.item?.isOffProgress,
                    active: this.item?.selected,
                    first: this.isFirst,
                    last: this.isLast,
                    disabled: this.disabled || this.item?.disabled,
                }}
                onClick={() => {
                    this.interact.emit();
                }}
            >
                {this.renderIcon()}
                <span class="btn-flow-text">{this.item.text}</span>
                <div class="btn-flow-divider" />
            </button>,
            this.renderSecondaryText(),
        ];
    }

    private renderSecondaryText() {
        if (!this.item?.secondaryText) {
            return;
        }

        return (
            <div class="btn-flow-seconday-text">{this.item.secondaryText}</div>
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
                class="btn-flow-icon"
            />
        );
    }
}
