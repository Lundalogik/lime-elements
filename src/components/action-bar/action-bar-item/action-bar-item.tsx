import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import { ActionBarItem, ListSeparator } from '../../../interface';
import { createRandomString } from '../../../util/random-string';
import {
    makeEnterClickable,
    removeEnterClickable,
} from 'src/util/make-enter-clickable';

/**
 * @private
 */
@Component({
    tag: 'limel-action-bar-item',
    shadow: false,
    styleUrl: 'action-bar-item.scss',
})
export class ActionBarButton {
    /**
     * Item that is placed in the action bar.
     */
    @Prop()
    public item!: ActionBarItem | ListSeparator;

    /**
     * Fired when a action bar item has been clicked.
     */
    @Event()
    public select: EventEmitter<ActionBarItem | ListSeparator>;

    /**
     * When the item is displayed in the available width,
     * this will be `false`.
     */
    @Prop({ reflect: true })
    public isVisible: boolean = true;

    @Element()
    private host: HTMLLimelActionBarItemElement;

    /**
     * Used to attach the right tooltip to the right button
     */
    private tooltipId: string;

    constructor() {
        this.tooltipId = createRandomString();
    }

    public componentWillLoad() {
        makeEnterClickable(this.host);
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
    }

    public render() {
        if (!this.isItem(this.item) && this.item.separator) {
            return <div role="separator" />;
        }

        return (
            <button
                id={this.tooltipId}
                type="button"
                onClick={this.handleClick}
                disabled={this.isDisabled()}
            >
                {this.renderIcon()}
                {this.renderLabel()}
                {this.renderTooltip()}
            </button>
        );
    }

    private handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.select.emit(this.item);
    };

    private isItem(item: ActionBarItem | ListSeparator): item is ActionBarItem {
        return !('separator' in item);
    }

    private isDisabled() {
        if (this.isItem(this.item) && this.item.disabled) {
            return true;
        }

        if (!this.isVisible) {
            return true;
        }
    }

    private renderIcon() {
        if (this.isItem(this.item) && !this.item.icon) {
            return;
        }

        if ('icon' in this.item) {
            return (
                <limel-icon
                    name={this.item.icon}
                    style={{
                        '--action-bar-item-icon-color': `${this.item.iconColor}`,
                    }}
                />
            );
        }
    }

    private renderLabel() {
        if (!this.isItem(this.item) || this.item.iconOnly) {
            return;
        }

        return <span class="text">{this.item.text}</span>;
    }

    private renderTooltip() {
        if (!this.isItem(this.item)) {
            return;
        }

        if (this.item.text) {
            return (
                <limel-tooltip
                    elementId={this.tooltipId}
                    label={this.item.text}
                    helperLabel={this.item.commandText}
                />
            );
        }

        if (this.item.commandText) {
            return (
                <limel-tooltip
                    elementId={this.tooltipId}
                    label={this.item.commandText}
                />
            );
        }
    }
}
