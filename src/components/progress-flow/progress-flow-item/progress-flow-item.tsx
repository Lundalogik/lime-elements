import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import { FlowItem } from '../progress-flow.types';
import { getIconName } from '../../icon/get-icon-props';

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

    /**
     * The flow item that should be rendered
     */
    @Prop()
    public item: FlowItem = null;

    /**
     * True if the flow item should be disabled
     */
    @Prop()
    public disabled = false;

    /**
     * True if the flow item should be readonly
     */
    @Prop()
    public readonly = false;

    /**
     * True for current step
     */
    @Prop()
    public currentStep: boolean = false;

    /**
     * Fired when clicking on the flow item
     */
    @Event()
    public interact: EventEmitter<void>;

    public render() {
        if (!this.item) {
            return;
        }

        return [
            <button
                tabindex="0"
                title={this.getToolTipText()}
                type="button"
                class={{
                    step: true,
                    selected: this.item?.selected,
                    disabled: this.isDisabled(),
                    readonly: this.readonly,
                }}
                onClick={this.handleClick}
                disabled={this.isDisabled()}
                aria-current={this.currentStep ? 'step' : null}
            >
                {this.renderIcon()}
                <span class="text">{this.item.text}</span>
                {this.renderDivider()}
                {this.renderLockIcon()}
            </button>,
            this.renderSecondaryText(),
        ];
    }

    private isDisabled() {
        return this.item?.disabled || this.readonly || this.disabled;
    }

    private getToolTipText() {
        if (!this.item.secondaryText) {
            return this.item.text;
        }

        return [this.item.text, this.item.secondaryText].join(' · ');
    }

    private handleClick = () => {
        this.interact.emit();
    };

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

        const name = getIconName(this.item.icon);

        return <limel-icon name={name} size="small" class="icon" />;
    }

    private renderDivider() {
        if (this.item.isOffProgress) {
            return;
        }

        return <div class="divider" />;
    }

    private renderLockIcon() {
        if (!this.isDisabled()) {
            return;
        }

        return <limel-icon name="lock" class="lock-icon" />;
    }
}
