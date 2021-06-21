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
    shadow: false,
    styleUrl: 'progress-flow-item.scss',
})
export class ProgressFlowItem {
    @Element()
    public element: HTMLLimelProgressFlowItemElement;

    @Prop()
    public item: FlowItem = null;

    @Prop()
    public disabled = false;

    @Prop()
    public readonly = false;

    @Event()
    public interact: EventEmitter<void>;

    /**
     * Icon displayed along with the text optionally
     */
    @Prop()
    public icon: string;

    public render() {
        const secondaryText = this.item.secondaryText
            ? ' · ' + this.item.secondaryText
            : '';
        const tooltip = this.item.text + secondaryText;

        return [
            <button
                tabindex="0"
                title={tooltip}
                type="button"
                class={{
                    step: true,
                    active: this.item?.selected,
                    disabled: this.disabled || this.item?.disabled,
                    readonly: this.readonly,
                }}
                onClick={() => {
                    this.interact.emit();
                }}
            >
                {this.renderIcon()}
                <span class="text">{this.item.text}</span>
                <div class="divider" />
            </button>,
            this.renderSecondaryText(),
        ];
    }

    private renderSecondaryText() {
        if (!this.item?.secondaryText) {
            return;
        }

        return <div class="secondary-text">{this.item.secondaryText}</div>;
    }

    private renderIcon() {
        if (!this.item.icon) {
            return;
        }

        return <limel-icon name={this.item.icon} size="small" class="icon" />;
    }
}
