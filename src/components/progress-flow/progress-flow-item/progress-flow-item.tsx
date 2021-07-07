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
     * Fired when clicking on the flow item
     */
    @Event()
    public interact: EventEmitter<void>;

    /**
     * Icon displayed along with the text optionally
     */
    @Prop()
    public icon: string;

    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }

    public render() {
        let secondaryText = this.item.secondaryText;
        if (secondaryText) {
            secondaryText = ' · ' + secondaryText;
        }

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
                onClick={this.handleClick}
            >
                {this.renderIcon()}
                <span class="text">{this.item.text}</span>
                <div class="divider" />
            </button>,
            this.renderSecondaryText(),
        ];
    }

    private handleClick() {
        this.interact.emit();
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
